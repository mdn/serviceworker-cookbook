self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(caches.open('catch-only').then(function (cache) {
    cache.addAll(['./asset']);
  }));
});

self.addEventListener('fetch', function(evt) {
  if (isAsset(evt.request.url)) {
    console.log('The service worker is serving the asset.');
    evt.respondWith(caches.match(evt.request));
  }
});

function isAsset(url) {
  return url.endsWith('asset');
}
