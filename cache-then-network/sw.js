// [Working example](/serviceworker-cookbook/cache-then-network/).

console.log('Running sw.js');

var cacheName = 'cache-then-network';

self.addEventListener('install', function(ev) {
  console.log('SW install event');
  ev.waitUntil(self.skipWaiting());
  console.log('Leaving SW install event');
});

self.addEventListener('activate', function(ev) {
  console.log('SW activate event');
  ev.waitUntil(self.clients.claim());
  console.log('Leaving SW activate event');
});

self.addEventListener('fetch', function(ev) {
  console.log('Got fetch event');

  var req = ev.request;
  var reqURL = new URL(req.url);

  if (reqURL.hostname === 'api.github.com') {
    console.log('Got request for github api');
    ev.respondWith(fetch(req).then(function(res) {
      console.log('SW fetched data');
      caches.open(cacheName).then(function(cache) {
        console.log('SW opened cache');
        cache.put(reqURL, res);
        console.log('SW cached data');
        cache.keys().then(function(keys) {
          console.log('Cache keys:');
          for (var it = 0; it < keys.length; it++) {
            console.log('\t' + keys[it]);
          }
        });
      });
      console.log('SW returning response');
      return res.clone();
    }));
  }

  // Any other handlers come here. Without calls to `ev.respondWith()` the
  // request will be handled without the ServiceWorker.
});

console.log('Leaving sw.js');
