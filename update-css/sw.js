var cacheName = 'update-css-2015.1015.1202';

self.addEventListener('install', function(ev) {
  self.skipWaiting();

  // TODO: Cache style-1.css as style.css
  // TODO: Comment explaining what would happen here in a real site
});

self.addEventListener('activate', function(ev) {
  if (self.clients && clients.claim) {
    clients.claim();
  }
});

self.addEventListener('fetch', function(ev) {
  /*
   * TODO:
   *   - Do the following only for 'style.css'
   *   - postmessage asking for current CSS file
   *   - initiate network fetch for current CSS file
   *     - when fetch completes check whether it's different from what's already in the cache
   *       - if no, done
   *       - if yes, postMessage to page telling it that new CSS is available
   *   - return cached info
   */
});
