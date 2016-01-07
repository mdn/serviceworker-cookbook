// TODO: When to check for updates? Every fetch?
// TODO: How to deal with multiple simultaneous update checks

const updateFilename = 'current.json';
const cachePrefix = 'update-css-';
const metaCacheName = cachePrefix + 'meta-cache';
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

  // A. Call update logic, store promise
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
  event.respondWith(getCurrentCache().then(function(cache) {
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

function getUpdateCacheName() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(updateKey);
  }).then(function(response) {
    if (!response || !response.ok || !response.text) {
      return Promise.reject();
    }

    return response.text();
  });
}

function getCurrentCache() {
  return getCurrentCacheName().then(function(currentCacheName) {
    return caches.open(currentCacheName);
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
        return setUpdateCacheName(generatedCacheName);
      }
    }).then(function() {
      // Create and populate updateCache
      return cacheFiles(generatedCacheName, fetchedJson.filenames).then(function() {
        //   Once all files check out, replace currentCache entry with updateCache entry
        return getUpdateCacheName().then(function(updateCacheName) {
          return setCurrentCacheName(updateCacheName);
        }).then(function() {
          return setUpdateCacheName(null);
        });
      });
    });
  });
}

function setCurrentCacheName(name) {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.put(currentKey, name);
  });
}

function setUpdateCacheName(name) {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.put(updateKey, name);
  });
}

function cacheFiles(cacheName, files) {
  // TODO: Eventually we may want to add logic here.
  // Some ideas:
  //   Validate files that are already in the cache
  //   Check files in the current cache against a checksum to see if we can just copy
  return caches.open(cacheName).then(function(cache) {
    return cache.addAll(files);
  });
}

function notifyClients() {
  self.clients.matchAll().then(function(clientList) {
    clientList.forEach(function(client) {
      client.postMessage({ msg: 'cssUpdated' });
    });
  });
}

/*
 * Implementation details
 */

const simulatedKey = 'simulatedFetch';

/**
 * simulateFetch
 *
 * In a real production environment, this function would not be necessary.
 * This function should perform the equivalent of `fetch(resource)`
 */
function simulateFetch(resource) {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.open(simulatedKey);
  }).then(function(simulatedResponse) {
    
  });
}
