var CACHE = 'cache-only';

// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache());
});

// On fetch, use cache only strategy.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  evt.respondWith(fromCache(evt.request));
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Extend the installation until all the assets are saved.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      './controlled.html',
      './asset'
    ]);
  });
}

// As simple as opening the proper cache and search for the requested resource.
// Notice in case of no matching, undefined is passed.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}
