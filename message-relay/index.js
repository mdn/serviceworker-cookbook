(function() {
  // Only setup the demo if service workers are supported.
  if (navigator.serviceWorker) {
    // Get the DOM nodes for our UI.
    var message = document.getElementById('message');
    var received = document.getElementById('received');
    var status = document.getElementById('status');
    var inbox = {};

    // Give an indicator that service workers are supported.
    status.textContent = 'supported';

    navigator.serviceWorker.register('service-worker.js');

    // Listen for any messages from the service worker.
    navigator.serviceWorker.addEventListener('message', function(event) {
      // A message has been received, now show the message on the page.
      var clientId = event.data.client;
      var node;
      // A message from this client hasn't been received before, so we need to
      // setup a place to show its messages.
      if (!inbox[clientId]) {
        node = document.createElement('div');
        received.appendChild(node);
        inbox[clientId] = node;
      }
      // Show the message.
      node = inbox[clientId];
      node.textContent = 'Client ' + clientId + ' says: ' + event.data.message;
    });

    message.addEventListener('input', function() {
      // There isn't always a service worker to send a message to. This can happen
      // when the page is force reloaded.
      if (!navigator.serviceWorker.controller) {
        status.textContent = 'error: no controller';
        return;
      }
      // Send the message to the service worker.
      navigator.serviceWorker.controller.postMessage(message.value);
    });
  }
})();
