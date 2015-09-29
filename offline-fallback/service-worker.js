// [Working example](/serviceworker-cookbook/offline-fallback/).

self.addEventListener('install', (event) => {
  // Put `offline.html` page into cache
  const offlineRequest = new Request('offline.html');
  event.waitUntil(
    fetch(offlineRequest).then((response) => {
      return caches.open('offline').then((cache) => {
        console.log('[oninstall] Cached offline page', response.url);
        return cache.put(offlineRequest, response);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only fall back for HTML documents.
  const request = event.request;
  // && request.headers.get('accept').includes('text/html')
  if (request.method === 'GET') {
    // `fetch()` will use the cache when possible, to this examples
    // depends on cache-busting URL parameter to avoid the cache.
    event.respondWith(
      fetch(request).catch((error) => {
        // `fetch()` throws an exception when the server is unreachable but not
        // for valid HTTP responses, even `4xx` or `5xx` range.
        console.error('[onfetch] Failed. Serving cached offline fallback', String(error));
        return caches.open('offline').then((cache) => {
          return cache.match('offline.html');
        });
      })
    );
  }
  // Any other handlers come here. Without calls to `event.respondWith()` the
  // request will be handled without the ServiceWorker.
});
