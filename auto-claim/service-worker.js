const version = '{{ version }}';

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installed version', version);
  event.waitUntil(
    fetch('./random-cached.jpg').then((response) => {
      return caches.open(version).then((cache) => {
        console.log('[ServiceWorker] Cached random.jpg for', version);
        // Important to `return` the promise here to have `skipWaiting()`
        // fire after the cache has been updated.
        return cache.put('random.jpg', response);
      });
    }).then(() => {
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      console.log('[ServiceWorker] Skip waiting on install');
      return self.skipWaiting();
    })
  );
});

// `onactivate` is usually called after a worker was installed and the page
// got refreshed. Since we call `skipWaiting()` in `oninstall`, `onactivate` is
// called immediately.
self.addEventListener('activate', (event) => {
  // Just for debugging, list all controlled clients.
  self.clients.matchAll({
    includeUncontrolled: true
  }).then((clientList) => {
    const urls = clientList.map(client => client.url);
    console.log('[ServiceWorker] Matching clients:', urls.join(', '));
  });

  event.waitUntil(
    // Delete old cache entries that don't match the current version.
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== version) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // `claim()` sets this worker as the active worker for a all clients that
      // match the workers scope and triggers an `oncontrollerchange` event for
      // the clients.
      console.log('[ServiceWorker] Claiming clients for version', version);
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/random.jpg')) {
    console.log('[ServiceWorker] Serving random.jpg for', event.request.url);
    event.respondWith(
      caches.open(version).then((cache) => {
        return cache.match('random.jpg').then((response) => {
          if (!response) {
            console.error('[ServiceWorker] Missing cache!');
          }
          return response;
        });
      })
    );
  }
  if (event.request.url.includes('/version')) {
    event.respondWith(new Response(version, {
      headers: {
        'content-type': 'text/plain'
      }
    }));
  }
});
