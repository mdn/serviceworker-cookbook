var cacheName = 'update-css-2015.1015.1202';

self.addEventListener('install', function(ev) {
  self.skipWaiting();

  // TODO: Comment explaining what would happen here in a real site

  ev.waitUntil(caches.open(cacheName).then(function(cache) {
    return cache.addAll([
      'style-1.css',
      'style-2.css',
    ]).then(getCurrentCSSFilename).then(function(filename) {
      // Cache whichever CSS file we currently want to serve as
      // 'style.css'
      return cache.match(filename).then(function(response) {
        if (response) {
          cache.put('style.css', response);
        }
      });
    });
  }));
});

self.addEventListener('activate', function() {
  if (self.clients && self.clients.claim) {
    self.clients.claim();
  }
});

self.addEventListener('fetch', function(ev) {
  // Only process fetch requests for 'style.css'. Let everything
  // else be handled normally.
  if (ev.request.url.lastIndexOf('style.css') === -1) {
    return;
  }

  // Respond with the cached version of 'style.css' after initiating
  // a network fetch to update our cache if necessary.
  ev.respondWith(caches.open(cacheName).then(function(cache) {
    // Perform a network fetch of 'style.css' to see if there's an updated
    // version available. If there is, replace our cached version with the
    // updated one and use `postMessage` to notify the page that there
    // is updated CSS available.
    simulateStyleCSSNetworkFetch().then(function(response) {
      // In real production code, we would use smarter heuristics to
      // determine if the CSS file that we requested has actually been
      // updated.
      if (response && response.text) {
        var clone = response.clone();
        clone.text().then(function(networkText) {
          cache.match('style.css').then(function(cachedResponse) {
            if (cachedResponse && cachedResponse.text) {
              cachedResponse.text().then(function(cacheText) {
                if (cacheText !== networkText) {
                  cache.put('style.css', response);
                  // Inform any open pages that a new CSS file is available on
                  // the server
                  notifyPageOfCSSUpdate(true);
                } else {
                  notifyPageOfCSSUpdate(false);
                }
              });
            } else {
              notifyPageOfCSSUpdate(false);
            }
          });
        });
      } else {
        notifyPageOfCSSUpdate(false);
      }
    });

    return cache.match('style.css');
  }));
});

function notifyPageOfCSSUpdate(isUpdated) {
  self.clients.matchAll().then(function(clientList) {
    clientList.forEach(function(client) {
      client.postMessage({ msg: 'cssUpdated', val: isUpdated });
    });
  });
}

function simulateStyleCSSNetworkFetch() {
  return getCurrentCSSFilename().then(function(filename) {
    return caches.open(cacheName).then(function(cache) {
      // return the specified CSS file from the cache
      return cache.match(filename);
    });
  });
}

function getCurrentCSSFilename() {
  return caches.open(cacheName).then(function(cache) {
    return cache.match('current-css-filename').then(function(cached) {
      if (cached.text) {
        return cached.text().then(function(text) {
          return text;
        });
      }

      cache.put('current-css-filename', new Response('style-1.css', { 'status': 200 }));
      return 'style-1.css';
    });
  });
}

