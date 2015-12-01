/* global fetch */

// Install the Service Worker ASAP.
self.oninstall = function(event) {
  event.waitUntil(self.skipWaiting());
};

self.onactivate = function(event) {
  event.waitUntil(self.clients.claim());
};

// When fetching, distinguish on the method. This is naive but it suffices for
// the example. For more sophisticated routing alternatives, use
// [ServiceWorkerWare](https://github.com/gaia-components/serviceworkerware/)
// or [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox).
self.onfetch = function(event) {
  // For this example, `GET` implies looking for a cached copy...
  if (event.request.method === 'GET') {
    event.respondWith(getFromRenderStoreOrNetwork(event.request));
  } else {
    // While `PUT` means to cache contents...
    event.respondWith(cacheInRenderStore(event.request).then(function() {
      return new Response({ status: 202 });
    }));
  }
};

// It tries to recover a cached copy for the document. If not found,
// it respond from the network.
function getFromRenderStoreOrNetwork(request) {
  return self.caches.open('render-store').then(function(cache) {
    return cache.match(request).then(function(match) {
      return match || fetch(request);
    });
  });
}

// Obtains the interpolated HTML contents of a `PUT` request from the
// `pokemon.js` client code and crafts an HTML response for the interpolated
// result.
function cacheInRenderStore(request) {
  return request.text().then(function(contents) {
    // Craft a `text/html` response for the contents to be cached.
    var headers = { 'Content-Type': 'text/html' };
    var response = new Response(contents, { headers: headers });
    return self.caches.open('render-store').then(function(cache) {
      // Associate the crafted response with the
      // [`referrer`](https://developer.mozilla.org/en-US/docs/Web/API/Request/referrer)
      // property of the request which is the URL of the client page
      // initiating the request.
      return cache.put(request.referrer, response);
    });
  });
}
