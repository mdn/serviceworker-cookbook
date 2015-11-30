/* global fetch */

self.oninstall = function(event) {
  event.waitUntil(self.skipWaiting());
};

self.onactivate = function(event) {
  event.waitUntil(self.clients.claim());
};

self.onfetch = function(event) {
  if (event.request.method === 'GET') {
    event.respondWith(getFromRenderStoreOrNetwork(event.request));
  } else {
    event.respondWith(cacheInRenderStore(event.request).then(answerCreated));
  }
};

function getFromRenderStoreOrNetwork(request) {
  return self.caches.open('render-store').then(function(cache) {
    return cache.match(request).then(function(match) {
      return match || fetch(request);
    });
  });
}

function cacheInRenderStore(request) {
  return request.text().then(function(contents) {
    var headers = { 'Content-Type': 'text/html' };
    var response = new Response(contents, { headers: headers, status: 200 });
    return self.caches.open('render-store').then(function(cache) {
      return cache.put(request.headers.get('x-url'), response);
    });
  });
}

function answerCreated() {
  return new Response({ status: 202 });
}
