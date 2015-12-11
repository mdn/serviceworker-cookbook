// [Working example](/serviceworker-cookbook/offline-status/).

var CACHE_NAME = 'dependencies-cache';

// Files required to make this app work offline
var REQUIRED_FILES = [
  'random-1.png',
  'random-2.png',
  'index.html',
  'index.js'
];

// Non-essential files which may be used often and so
// it would be benefitial to add to SW cache for sake of speed/performance
var PERFORMANCE_FILES = [
  'random-3.png',
  'random-4.png',
  'random-5.png',
  'random-6.png'
];

self.addEventListener('install', function(event) {
  // Perform install step:  loading each required file into cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Add non-essential files to cache if possible
        // Since this doesn't "return", if any item fails, the
        // service worker still installs properly with
        // essential offline files
        cache.addAll(PERFORMANCE_FILES);

        // Add all offline dependencies to the cache
        console.log('[install] Caches opened, adding all offline components' +
          'to cache');
        return cache.addAll(REQUIRED_FILES);
      })
      .then(function() {
        console.log('[install] All offline resources have been cached, ' +
          'we\'re good!');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return the response from the cached version
        if (response) {
          console.log(
            '[fetch] Returning from ServiceWorker cache: ',
            event.request.url
          );
          return response;
        }

        // Not in cache - return the result from the live server
        // `fetch` is essentially a "fallback"
        console.log('[fetch] Returning from server: ', event.request.url);
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  console.log('[activate] Activating ServiceWorker!');

  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  console.log('[activate] Claiming this ServiceWorker!');
  event.waitUntil(self.clients.claim());
});
