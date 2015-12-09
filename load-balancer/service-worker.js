// The code in `oninstall` and `onactivate` force the service worker to
// control the clients ASAP.
self.oninstall = function(event) {
  event.waitUntil(self.skipWaiting());
};

self.onactivate = function(event) {
  event.waitUntil(self.clients.claim());
};

// When fetching, distinguish if this is a resource fetch. If so,
// apply the server selection algorithm. Else, let the request reach the
// network. Could should be autoexplanatory.
self.onfetch = function(event) {
  var request = event.request;
  if (isResource(request)) {
    event.respondWith(fetchFromBestServer(request));
  } else {
    event.respondWith(fetch(request));
  }
};

// A request is a resource request if it is a `GET` for something inside `imgs`.
function isResource(request) {
  return request.url.match(/\/imgs\/.*$/) && request.method === 'GET';
}

// Fetching from the best server consists of getting the server loads,
// selecting the server with lowest load, and compose a new request to
// find the resource in the selected server.
function fetchFromBestServer(request) {
  var session = request.url.match(/\?session=([^&]*)/)[1];
  return getServerLoads(session)
    .then(selectServer)
    .then(function(serverUrl) {
      // Get the resource path and combine with `serverUrl` to get
      // the resource URL but **in the selected server**.
      var resourcePath = request.url.match(/\/imgs\/[^?]*/)[0];
      var serverRequest = new Request(serverUrl + resourcePath);
      return fetch(serverRequest);
    });
}

// Query the back-end for servers loads.
function getServerLoads(session) {
  return fetch('./server-loads?session=' + session).then(function(response) {
    return response.json();
  });
}

// Get the server with minimum load and return its URL. In a real
// scenario this could return servers in other domains, just remember
// to set the CORS headers properly.
function selectServer(serverLoads) {
  // Not very efficient but super-clear way of finding the index of the server
  // with minimum load.
  var min = Math.min.apply(Math, serverLoads);
  var serverIndex = serverLoads.indexOf(min);

  // Servers are 1, 2, 3...
  return './server-' + (serverIndex + 1);
}
