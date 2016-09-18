var CACHE = 'cache-only';

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

// On fetch, use cache only strategy.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  evt.respondWith(cacheOnly(evt.request));
});

// Cache only is as simple as opening the proper cache and search for the
// requested resource.
function cacheOnly(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}
