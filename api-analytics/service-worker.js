// In a real use case, the endpoint could point to another origin.
var LOG_ENDPOINT = 'report/logs';

// The code in `oninstall` and `onactive` force the service worker to
// control the clients ASAP.
self.oninstall = function(event) {
  event.waitUntil(self.skipWaiting());
};

self.onactivate = function(event) {
  event.waitUntil(self.clients.claim());
};

self.onfetch = function(event) {
  event.respondWith(
    // Log the request …
    log(event.request)
    // … and then actually perform it.
    .then(fetch)
  );
};

// Post basic information of the request to a backend for historical purposes.
function log(request) {
  var returnRequest = function() {
    return request;
  };

  var data = {
    method: request.method,
    url: request.url
  };

  return fetch(LOG_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' }
  })
  .then(returnRequest, returnRequest);
}
