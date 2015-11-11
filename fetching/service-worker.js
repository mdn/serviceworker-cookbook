// [Working example](/serviceworker-cookbook/offline-fallback/).

self.addEventListener('install', function(event) {
  console.log('DEBUG: service worker installed');
  event.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  console.log('DEBUG: service worker proxy', event.request);
  event.respondWith(fetch(event.request));
});
