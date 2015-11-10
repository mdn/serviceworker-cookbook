// In a real use case, the endpoint could point to another origin.
var LOG_ENDPOINT = 'report/logs';

// The code in `oninstall` and `onactive` force the service worker to
// control the clients ASAP.
self.oninstall = function(event) {
  event.waitUntil(self.skipWaiting());
};

self.onactive = function(event) {
  event.waitUntil(self.clients.claim());
};

// Fetch is as simply as log the request and passthrough.
// Water clear thanks to the promise syntax!
self.onfetch = function(event) {
  event.respondWith(log(event.request).then(fetch));
};

// Post basic information of the request to a backend for historical purposes.
function log(request) {
  var returnRequest = function() { return Promise.resolve(request); };
  var data = { method: request.method, url: request.url };
  return fetch(LOG_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' }
  }).then(returnRequest, returnRequest);
}
