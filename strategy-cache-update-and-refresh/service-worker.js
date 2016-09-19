var CACHE = 'cache-update-and-refresh';

// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  // Open a cache and use `addAll()` with an array of assets to add all of them
  // to the cache. Extend the installation until all the assets are saved.
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
      './controlled.html',
      './asset'
    ]);
  }));
});

// On fetch, use cache but update the entry with the latest contents
// the from server.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  // You can use `respondWith()` to answer ASAP...
  evt.respondWith(cacheOnly(evt.request));
  // ...and `waitUntil()` to prevent the worker to be killed until
  // the cache is updated.
  evt.waitUntil(
    update(evt.request)
    // Finally, send a message to the referrer to inform him about the
    // resource is up to date.
    .then(refresh)
  );
});

// Cache only is as simple as opening the proper cache and search for the
// requested resource.
function cacheOnly(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}

// Update consists into open the proper cache, perform a network request and
// `put()` the new request and response pair.
function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

// Sends a message to the clients
function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      // Encode which resource has been updated. By including the
      // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
      // check if the content has changed.
      var message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag')
      };
      // Tell the client about the update.
      client.postMessage(JSON.stringify(message));
    });
  });
}
