// [Working example](/serviceworker-cookbook/offline-fallback/).

self.oninstall = function(event) {
  console.log('DEBUG: service worker installed');
  event.waitUntil(self.skipWaiting());
};

self.onactivate = function(event) {
  console.log('DEBUG: service worker activated');
  event.waitUntil(self.clients.claim());
};

self.onfetch = function(event) {
  console.log('DEBUG: service worker proxy', event.request.url);
  event.respondWith(fetch(event.request));
};
