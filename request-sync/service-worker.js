/* eslint no-unused-vars: 0 */
/* global importScripts, ServiceWorkerWare, localforage */
importScripts('./lib/ServiceWorkerWare.js');
importScripts('./lib/localforage.js');

// Determine the root for the routes. This convert something like
// `http://example.com/path/to/sw.js` to
// `http://example.com/path/to/`
var root = (function() {
  var tokens = (self.location + '').split('/');
  tokens[tokens.length - 1] = '';
  return tokens.join('/');
}());

// By using Mozilla's ServiceWorkerWare we can quickly setup this
// _client server_.
var worker = new ServiceWorkerWare();

// So here is the idea. We will check if we are online or not. In case
// we are not online, enqueue the request and provide a fake response.
// Else, flush the queue and let the new request to reach the network.

// This function factory does exactly that.
function tryOrFallback(fakeResponse) {
  // Return a handler that...
  return function(req, res) {
    // If offline, enqueue and answer with the fake response.
    if (!navigator.onLine) {
      console.log('No network availability, enqueuing');
      return enqueue(req).then(function() {
        // As the fake response will be reused but Response objects
        // are one use only, we need to clone it each time we use it.
        return fakeResponse.clone();
      });
    }

    // If online, flush the queue and answer from network.
    console.log('Network available! Flushing queue.');
    return flushQueue().then(function() {
      return fetch(req);
    });
  };
}

// A fake response with a joke for when there is no connection.
worker.get(root + 'api/quotations?*', tryOrFallback(new Response(JSON.stringify([{
  text: 'You are offline and I know it well.',
  author: 'The Service Worker Cookbook',
  id: 1,
  isSticky: true
}]), { headers: { 'Content-Type': 'application/json' } })));

// For deletion, let's simulate that all went OK.
worker.delete(root + 'api/quotations/:id?*', tryOrFallback(new Response({
  status: 204
})));

// Creation is another story. We can not reach the server so we can not
// get the id for the new quotations. No problem, just say we accept the
// creation and we will process it as soon as we recover connectivity.
worker.post(root + 'api/quotations?*', tryOrFallback(new Response(null, {
  status: 202
})));

// And a virtual route to force the sync
worker.post(root + 'api/sync', function() {
  return flushQueue().then(function() {
    return new Response({ status: 202 });
  });
});

// Start the service worker
worker.init();

// By using Mozilla's localforage db wrapper, we count with
// a fast setup for a versatile key, value database. We use
// it to store queue of deferred requests.

// Enqueue consists into add to the list a pair of method, url.
function enqueue(request) {
  return serialize(request).then(function(request) {
    localforage.getItem('queue').then(function(queue) {
      queue = queue || [];
      queue.push(request);
      return localforage.setItem('queue', queue).then(function() {
        console.log(request.method, request.url, 'enqueued!');
      });
    });
  });
}

// Flush is a little more complicated. It consists into get
// the elements of the queue in order and send each one,
// keeping track of not yet sent request.
function flushQueue() {
  // Get the queue
  return localforage.getItem('queue').then(function(queue) {
    queue = queue || [];

    // If empty, nothing to do!
    if (!queue.length) {
      return Promise.resolve();
    }

    // Else, send the requests in order...
    console.log('Sending ', queue.length, ' requests...');
    return sendInOrder(queue).then(function() {
      return localforage.setItem('queue', []);
    });
  });
}

// Send the requests inside the queue in order. Waiting for the current before
// sending the next one.
function sendInOrder(requests) {
  var sending = Promise.resolve();
  requests.forEach(function(request) {
    console.log('Sending', request.method, request.url);
    sending = sending.then(function() {
      return deserialize(request).then(function(request) {
        fetch(request);
      });
    });
  });
  return sending;
}

// Serialize is a little bit convolved due to headers is
// a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
// and not a simple object.
function serialize(request) {
  var headers = {};
  for (var entry of request.headers.entries()) {
    headers[entry[0]] = entry[1];
  }
  var serialized = {
    url: request.url,
    headers: headers,
    method: request.method,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer
  };

  // Only if method is not GET or HEAD is the request allowed to have body.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return request.clone().text().then(function (body) {
      serialized.body = body;
      return Promise.resolve(serialized);
    });
  }
  return Promise.resolve(serialized);
}

// Compared, deserialize is pretty simple.
function deserialize(data) {
  return Promise.resolve(new Request(data.url, data));
}
