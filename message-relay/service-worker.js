// Listen for messages from clients.
self.addEventListener('message', function(event) {
  // Get all the connected clients and forward the message along.
  var promise = self.clients.matchAll()
  .then(function(clientList) {
    // event.source.id contains the ID of the sender of the message.
    var senderID = event.source ? event.source.id : 'unknown';

    // We'll also print a warning, so users playing with the demo aren't confused.
    if (!event.source) {
      console.log('event.source is null; we don\'t know the sender of the ' +
                  'message');
    }

    clientList.forEach(function(client) {
      // Skip sending the message to the client that sent it.
      if (client.id === senderID) {
        return;
      }
      client.postMessage({
        client: senderID,
        message: event.data
      });
    });
  });

  // If event.waitUntil is defined, use it to extend the
  // lifetime of the Service Worker.
  if (event.waitUntil) {
    event.waitUntil(promise);
  }
});

// Immediately claim any new clients. This is not needed to send messages, but
// makes for a better demo experience since the user does not need to refresh.
// A more complete example of this given in the immediate-claim recipe.
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
