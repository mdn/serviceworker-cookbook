const updateFilename = 'current.json';
const metaCacheName = 'update-css';
const cachePrefix = 'update-css-';
const currentKey = 'current';
const updatingKey = 'updating';

// Our cache only ever has two entries:
//   currentCacheName tells us what cache holds our actual data
//   updatingCacheName tells us where we're downloading an update to
//
// Invariants:
//   1. If a currentCache exists, it will always be complete


self.addEventListener('install', function(event) {
});

self.addEventListener('activate', function() {
  if (self.clients && self.clients.claim) {
    self.clients.claim();
  }

  // A. Call updateLogic, store promise
  const updatePromise = updateResources();

  // B. Check whether we have a currentCache available
  event.waitUntil(getCurrentCacheName().catch(function() {
    //    If not, the cache needs to be populated. Wait on the promise acquired
    //    in A.
    return updatePromise;
  }));
});

self.addEventListener('fetch', function(event) {
  // Return response from currentCache
  event.respondWith(getCurrentCacheName().then(function(currentCacheName) {
    return caches.open(currentCacheName);
  }).then(function(cache) {
    return cache.match(event.request.url);
  }).then(function(response) {
    if (!response) {
      throw new Error('Item not in cache: ' + event.request.url);
    }

    return response;
  }).catch(function(err) {
    // On any failure, go to the network
    return fetch(event.request);
  }));
});

function getCurrentCacheName() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentKey);
  }).then(function(response) {
    if (!response || !response.ok || !response.text) {
      return Promise.reject();
    }

    return response.text();
  });
}

function updateResources() {
  // Download current.json
  return simulateFetch(updateFilename).then(function(fetchedResponse) {
    if (!fetchedResponse || !fetchedResponse.ok || !fetchedResponse.json) {
      return Promise.reject(new Error('Bad response when fetching ' + updateFilename));
    }

    // Compare it against our currentCache
    return Promise.all([
       fetchedResponse.json(),
       getCurrentCacheName(),
    ]);
  }).then(function(fetchedJson, currentCacheName) {
    const generatedCacheName = cachePrefix + fetchedJson.id;

    // If the same, stop
    if (currentCacheName === generatedCacheName) {
      return;
    }

    // Compare it to our updateCache
    return getUpdateCacheName().then(function(updateCacheName) {
      // If different, obliterate updateCache
      if (updateCacheName !== generatedCacheName) {
        // `CacheStorage.delete` returns a promise but we don't care about the result
        caches.delete(updateCacheName);
        // Make updateCache entry point to the new cache we're creating
        return changeUpdateCacheName(generatedCacheName);
      }
    }).then(function() {
      // Create and populate updateCache
      return cacheFiles(generatedCacheName, fetchedJson.filenames).then(function() {
        //   Once all files check out, replace currentCache entry with updateCache entry
        return replaceCurrentCacheWithUpdateCache();
      });
    });
  });
}

function cacheFiles(json) {
  // For each file in current.json, validate and redownload if necessary,
  // caching in updateCache
}

function performCacheUpdate() {
  // Make updateCache the new currentCache
  // Remove updateCache entry
  // Notify clients that update is available
  self.clients.matchAll().then(function(clientList) {
    clientList.forEach(function(client) {
      client.postMessage({ msg: 'cssUpdated', val: isUpdated });
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
 * In a real production environment, this function would not be necessary.
 * This function should perform the equivalent of `fetch(resource)`
 */
function simulateFetch(resource) {
}
