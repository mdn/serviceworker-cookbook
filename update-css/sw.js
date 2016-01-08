/* eslint indent: 0 */

// TODO: When to check for updates? Every fetch?
// TODO: How to deal with multiple simultaneous update checks

var cachePrefix = 'update-css-';
var metaCacheName = cachePrefix + 'meta-cache';
var currentKey = 'current';
var updateKey = 'update';

// Our cache only ever has two entries:
//   currentCacheName tells us what cache holds our actual data
//   updatingCacheName tells us where we're downloading an update to
//
// Invariants:
//   1. If a currentCache exists, it will always be complete

var updatePromise = Promise.resolve();
var isUpdateCheckInProgress = false;

self.addEventListener('install', function() {
});

self.addEventListener('activate', function(event) {
  if (self.clients && self.clients.claim) {
    self.clients.claim();
  }

  // A. Call update logic, store promise
  updateResources();

  // B. Check whether we have a currentCache available
  event.waitUntil(getCurrentCacheName().then(function(name) {
    if (!name) {
      //    If not, the cache needs to be populated. Wait on the promise acquired
      //    in A.
      return updatePromise;
    }
  }));
});

self.addEventListener('fetch', function(event) {
  updateResources();

  // Return response from currentCache
  event.respondWith(getCurrentCache().then(function(cache) {
    return cache.match(event.request.url);
  }).then(function(response) {
    if (!response) {
      throw new Error('Item not in cache: ' + event.request.url);
    }

    return response;
  }).catch(function() {
    // On any failure, go to the network
    return fetch(event.request);
  }));
});

function getCurrentCacheName() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentKey);
  }).then(function(response) {
    if (!response || !response.ok || !response.text) {
      return null;
    }

    return response.text();
  });
}

function getUpdateCacheName() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(updateKey);
  }).then(function(response) {
    if (!response || !response.ok || !response.text) {
      return null;
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
  if (isUpdateCheckInProgress) {
    return updatePromise;
  }

  isUpdateCheckInProgress = true;

  // Download current.json
  updatePromise = getCurrentJSON().then(function(fetchedResponse) {
    if (!fetchedResponse || !fetchedResponse.ok || !fetchedResponse.json) {
      // Immediately give up on failure
      isUpdateCheckInProgress = false;
      return Promise.reject('Unable to retrieve current.json');
    }

    // Compare it against our currentCache
    return Promise.all([
      fetchedResponse.json(),
      getCurrentCacheName(),
    ]);
  }).then(function(fetchedJson, currentCacheName) {
    // TODO: Why do we get an array here instead of just the first object?
    var json = fetchedJson[0];

    var generatedCacheName = cachePrefix + json.id;

    console.log('generatedCacheName = ' + generatedCacheName);
    console.log('currentCacheName = ' + currentCacheName);

    // If the same, stop
    if (currentCacheName === generatedCacheName) {
      return Promise.resolve();
    }

    // Compare it to our updateCache
    return getUpdateCacheName().then(function(updateCacheName) {
      // If different, obliterate updateCache
      if (updateCacheName !== generatedCacheName) {
        if (updateCacheName) {
          // `CacheStorage.delete` returns a promise but we don't care about the result
          caches.delete(updateCacheName);
        }
        // Make updateCache entry point to the new cache we're creating
        return setUpdateCacheName(generatedCacheName);
      }
    }).then(function() {
      // Create and populate updateCache
      return cacheFiles(generatedCacheName,
                        json.filenames).then(function() {
        //   Once all files check out, replace currentCache entry with updateCache entry
        return getUpdateCacheName().then(function(updateCacheName) {
          console.log('updateCacheName = ' + updateCacheName);
          return setCurrentCacheName(updateCacheName);
        }).then(function() {
          return setUpdateCacheName(null);
        }).then(function() {
          notifyClients();
          isUpdateCheckInProgress = false;
        });
      });
    });
  });

  return updatePromise;
}

function setCurrentCacheName(name) {
  console.log('setCurrentCacheName - ' + name);
  return caches.open(metaCacheName).then(function(cache) {
    return cache.put(currentKey, new Response(name, { status: 200 }));
  });
}

function setUpdateCacheName(name) {
  console.log('setUpdateCacheName - ' + name);
  return caches.open(metaCacheName).then(function(cache) {
    return cache.put(updateKey, new Response(name, { status: 200 }));
  });
}

function cacheFiles(cacheName, files) {
  console.log('cacheFiles. files=' + files);
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

var currentJSONKey = 'currentJSON';

/**
 * getCurrentJSON
 *
 * In a real production environment, this function would not be necessary.
 * This function should perform the equivalent of `fetch(resource)`
 */
function getCurrentJSON() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentJSONKey);
  });
}
