// Listen for messages from clients.
self.addEventListener('message', function(event) {
  // Get all the connected clients and forward the message along.
  self.clients.matchAll().then(function(clientList) {
    clientList.forEach(function(client) {
      // Skip sending the message to the client that sent it.
      if (client.id === event.source.id) {
        return;
      }
      client.postMessage({
        client: event.source.id,
        message: event.data
      });
    });
  });
});

// Immediately claim any new clients. This is not needed to send messages, but
// makes for a better demo experience since the user does not need to refresh.
// A more complete example of this given in the immediate-claim recipe.
self.addEventListener('activate', function() {
  self.clients.claim();
});
