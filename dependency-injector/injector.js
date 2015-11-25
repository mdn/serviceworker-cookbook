/* eslint no-unused-vars: 0 */
/* global mapping */

// This script must to be added via `importScripts()` to the
// service workers. See `testing-sw.js` and `production-sw.js`
// first.

// Make the SW control the client ASAP.
function onInstall(event) {
  event.waitUntil(self.skipWaiting());
}

function onActivate(event) {
  event.waitUntil(self.clients.claim());
}

// Easy, simply try to find an actual resource URL for an abstract request.
// If not found, let's fetch the abstract resource. In this demo, this never
// fails.
function onFetch(event) {
  var abstractResource = event.request.url;
  var actualResource = findActualResource(abstractResource);
  event.respondWith(fetch(actualResource || abstractResource));
}

// Look inside mapping to get the actual resource URL for the abstract resource URL
// passed as parameter. This act like the dependency factory in charge of creating
// the objects to be injected.
function findActualResource(abstractResource) {
  var actualResource;
  var patterns = Object.keys(mapping);
  for (var index = 0; index < patterns.length; index++) {
    var pattern = patterns[index];
    // A really silly matcher just for learning purposes.
    if (abstractResource.endsWith(pattern)) {
      actualResource = mapping[pattern];
      break;
    }
  }
  // Can return undefined if there is no actual resource.
  return actualResource;
}
