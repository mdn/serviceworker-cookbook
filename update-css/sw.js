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


self.addEventListener('install', function() {
});

self.addEventListener('activate', function(event) {
  var wait = [self.clients.claim()];

  // A. Call update logic, store promise
  var p = updateResources();

  // B. Check whether we have a currentCache available
  wait.push(getCurrentCacheName().then(function(name) {
    if (!name) {
      //    If not, the cache needs to be populated. Wait on the promise acquired
      //    in A.
      return p;
    }
  }));

  event.waitUntil(Promise.all(wait));
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

    console.log('cache: ' + event.request.url);

    return response;
  }).catch(function() {
    // On any failure, go to the network
    console.log('network: ' + event.request.url);
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
    console.log('updateResources - not starting');
    return updatePromise;
  }
  console.log('updateResources - start');

  isUpdateCheckInProgress = true;

  // Download current.json
  //   In a real environment, this call could fail and we should deal
  //   with errors
  updatePromise = getCurrentJSON().then(function(json) {
    var generatedCacheName = cachePrefix + json.id;

    // Compare it against our currentCache
    return getCurrentCacheName().then(function(currentCacheName) {
      console.log('sw.js newest - ' + generatedCacheName);
      console.log('sw.js current - ' + currentCacheName);

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
  // TODO: Eventually we may want to add logic here.
  // Some ideas:
  //   Validate files that are already in the cache
  //   Check files in the current cache against a checksum to see if we can just copy
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

/*
 * Implementation details
 */

var currentJSONKey = 'currentJSON';
var currents = [
  { id: 0, files: [{ name: 'style-0.css', cacheAs: 'style.css' }] },
  { id: 1, files: [{ name: 'style-1.css', cacheAs: 'style.css' }] },
];

var isTogglingVersion = false;
self.addEventListener('message', function(event) {
  if (!event.data || !event.data.msg) {
    return;
  }

  if (event.data.msg === 'toggleVersion') {
    if (isTogglingVersion) {
      return;
    }

    isTogglingVersion = true;

    caches.open(metaCacheName).then(function(cache) {
      return cache.match(currentJSONKey).then(function(response) {
        if (!response || !response.ok || !response.json) {
          var json = JSON.stringify(currents[0]);
          console.log('json = ' + json);
          return cache.put(currentJSONKey,
                           new Response(json, { status: 200 }));
        }

        return response.json().then(function(resJSON) {
          console.log('resJSON.id = ' + resJSON.id);
          var id = (resJSON.id + 1) % currents.length;
          var newJSON = JSON.stringify(currents[id]);
          console.log('newJSON = ' + newJSON);
          return cache.put(currentJSONKey,
                           new Response(newJSON,
                                        { status: 200 }));
        });
      });
    }).then(function() {
      return notifyClients('currentJSONUpdated');
    }).then(function() {
      isTogglingVersion = false;
    });
  }
});

/**
 * getCurrentJSON
 *
 * In a real production environment, this function would not be necessary.
 * This function should perform the equivalent of `fetch(resource)`
 */
function getCurrentJSON() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentJSONKey).then(function(response) {
      if (!response || !response.ok || !response.json) {
        return cache.put(currentJSONKey,
                         new Response(JSON.stringify(currents[0]),
                                      { status: 200 }))
        .then(function() { return currents[0]; });
      }

      return response.json();
    });
  });
}
