var cacheName = 'update-css-2015.1015.1202';

self.addEventListener('install', function(ev) {
  self.skipWaiting();

  // TODO: Add style-1.css to the cache
});

self.addEventListener('activate', function(ev) {
  if (self.clients && clients.claim) {
    clients.claim();
  }
});

self.addEventListener('fetch', function(ev) {
  /*
   * TODO:
   *   - initiate network fetch
   *     - when fetch completes postMessage to the main page
   *     - main page reloads or pops up UI
   *   - return cached info
   */
});
