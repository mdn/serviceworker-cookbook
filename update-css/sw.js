/* eslint indent: 0 */

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

function log(msg) {
  console.log('|SW| ' + msg);
}


self.addEventListener('install', function() {
  log('install event (no-op)');
});

self.addEventListener('activate', function(event) {
  log('activate event');
  log('claiming clients');
  var wait = [self.clients.claim()];

  // A. Call update logic, store promise
  log('initiating check for updated resources');
  var p = updateResources();

  // B. Check whether we have a currentCache available
  wait.push(getCurrentCacheName().then(function(name) {
    if (!name) {
      log('no resources are cached');
      log('activate event will not complete until resources are cached');
      //    If not, the cache needs to be populated. Wait on the promise acquired
      //    in A.
      return p;
    }
    log('cached resources are now available');
  }));

  event.waitUntil(Promise.all(wait));
});

self.addEventListener('fetch', function(event) {
  log('fetch - ' + event.request.url);
  log('initiating check for updated resources');
  updateResources();

  // Return response from currentCache
  event.respondWith(getCurrentCache().then(function(cache) {
    return cache.match(event.request.url);
  }).then(function(response) {
    if (!response) {
      throw new Error('Item not in cache: ' + event.request.url);
    }

    log('fetched from cache: ' + event.request.url);

    return response;
  }).catch(function() {
    // On any failure, go to the network
    log('fetching from network: ' + event.request.url);
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

var isUpdateCheckInProgress = false;
var updatePromise = Promise.resolve();
function updateResources() {
  if (isUpdateCheckInProgress) {
    log('update check - not starting because another is already in progress');
    return updatePromise;
  }
  log('updateResources - start');

  isUpdateCheckInProgress = true;

  // Download current.json
  updatePromise = fetch('current.json').then(function(res) {
    // In a real environment, this call could fail and we should deal
    // with errors
    return res.json();
  }).then(function(json) {
    var generatedCacheName = cachePrefix + json.id;

    // Compare it against our currentCache
    return getCurrentCacheName().then(function(currentCacheName) {
      log('update check: server version - ' + generatedCacheName);
      log('update check: cached version - ' + currentCacheName);

      // If the same, stop
      if (currentCacheName === generatedCacheName) {
        isUpdateCheckInProgress = false;
        return Promise.resolve();
      }

      // Compare it to our updateCache
      return getUpdateCacheName().then(function(updateCacheName) {
        // If different, obliterate updateCache
        if (updateCacheName !== generatedCacheName) {
          if (updateCacheName) {
            log('obliterating partially downloaded resource cache - ' + updateCacheName);
            // `CacheStorage.delete` returns a promise but we don't care about the result
            caches.delete(updateCacheName);
          }
          // Make updateCache entry point to the new cache we're creating
          return setUpdateCacheName(generatedCacheName);
        }
      }).then(function() {
        // Create and populate updateCache
        return cacheFiles(generatedCacheName,
                          json.files).then(function() {
          //   Once all files check out, replace currentCache entry with updateCache entry
          return getUpdateCacheName().then(function(updateCacheName) {
            return setCurrentCacheName(updateCacheName);
          }).then(function() {
            return setUpdateCacheName(null);
          }).then(function() {
            log('resources cached, notifying clients');
            notifyClients('cacheUpdated');
            isUpdateCheckInProgress = false;
          });
        });
      });
    });
  });

  return updatePromise;
}

function setCurrentCacheName(name) {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.put(currentKey, new Response(name, { status: 200 }));
  });
}

function setUpdateCacheName(name) {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.put(updateKey, new Response(name, { status: 200 }));
  });
}

function cacheFiles(cacheName, files) {
  // TODO: Eventually we may want to add logic here.
  // Some ideas:
  //   Validate files that are already in the cache
  //   Check files in the current cache against a checksum to see if we can just copy
  log('downloading/caching files in ' + cacheName);
  return caches.open(cacheName).then(function(cache) {
    var promises = [];

    function addPromise(c, name, cacheAs) {
      promises.push(fetch(name).then(function(response) {
        return c.put(cacheAs, response);
      }));
    }

    for (var i = 0; i < files.length; i++) {
      addPromise(cache, files[i].name, files[i].cacheAs);
    }

    return Promise.all(promises);
  });
}

function notifyClients(msg) {
  self.clients.matchAll().then(function(clientList) {
    clientList.forEach(function(client) {
      client.postMessage({ msg: msg });
    });
  });
}
