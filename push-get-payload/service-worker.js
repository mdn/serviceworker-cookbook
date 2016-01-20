function getEndpoint() {
  return self.registration.pushManager.getSubscription()
  .then(subscription => {
    if (subscription) {
      return subscription.endpoint;
    }

    throw new Error('User not subscribed');
  });
}

// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    getEndpoint()
    // Retrieve the textual payload from the server using a GET request.
    // We are using the endpoint as an unique ID of the user for simplicity.
    .then(endpoint => fetch('./getPayload?endpoint=' + endpoint))
    .then(response => response.text())
    .then(payload => 
      // Show a notification with title 'ServiceWorker Cookbook' and use the payload
      // as the body.
      self.registration.showNotification('ServiceWorker Cookbook', {
        body: payload,
      })
    )
  );
});
