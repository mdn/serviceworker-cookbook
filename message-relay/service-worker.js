// Listen for messages from clients.
self.addEventListener('message', function(event) {
  event.waitUntil(
    // Get all the connected clients and forward the message along.
    self.clients.matchAll()
    .then(function(clientList) {
      // event.source.id contains the ID of the sender of the message.
      // `event` in Chrome isn't an ExtendableMessageEvent yet (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#extendablemessage-event-interface),
      // so it doesn't have the `source` property.
      // https://code.google.com/p/chromium/issues/detail?id=543198
      var senderID = event.source ? event.source.id : 'unknown';

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
    })
  );
});

// Immediately claim any new clients. This is not needed to send messages, but
// makes for a better demo experience since the user does not need to refresh.
// A more complete example of this given in the immediate-claim recipe.
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
