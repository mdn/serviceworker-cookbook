const cacheName = 'update-css-2015.1015.1202';
const updateFilename = 'current.json';

self.addEventListener('install', function(event) {
  self.skipWaiting();

  event.waitUntil(updateResources());
});

self.addEventListener('activate', function() {
  if (self.clients && self.clients.claim) {
    self.clients.claim();
  }
});

self.addEventListener('fetch', function(event) {
  // TODO: Make this smarter; we want to show how it is
  // possible to filter fetch events for CSS, fonts, images, etc.
  if (event.request.url.lastIndexOf('style.css') === -1) {
    return;
  }

  // Return response from cache
  event.respondWith(caches.open(cacheName).then(function(cache) {
    return cache.match(event.request.url);
  }));
});

function updateResources() {
  // Fetch update file
  simulateFetch(updateFilename).then(function(response) {
    if (!response || !response.ok || !response.json) {
      var err = new Error('Bad response when fetching ' + updateFilename);
      console.error(err);
      throw(err);
    }

    // Compare update file to 
    Pomise.all([
        caches.open(cacheName),
        response.json()
    ]).then(function(cache, fileList) {
      fileList.forEach(function(file) {
        cache.match(file.name).then(function(cachedResponse) {

          // Initiate updates for each resource that needs updating
        });

        // At this point we could optionally remove any entries in the
        // cache that don't appear in the update file; those resources
        // no longer exist in the web app
      });
    });

    // Notify page that update is available
    self.clients.matchAll().then(function(clientList) {
      clientList.forEach(function(client) {
        client.postMessage({ msg: 'cssUpdated', val: isUpdated });
      });
    });
  });
}


/*
 * Implementation details
 */

const cacheForSimulatedFetches = 'update-css-simulated-fetches-2015.1117.1636';

/**
 * simulateFetch
 *
 * In a real production environment, this function would be equivalent
 * to performing a regular `fetch` for a particular resource.
 */
function simulateFetch(resource) {
}


