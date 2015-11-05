self.addEventListener('push', function(event) {
  // server send a push notification
  console.log('Push event fired');
  event.waitUntil(self.registration.showNotification('ServiceWorker Cookbook', {
    body: 'Push Notification Subscription Management'
  }));
});

// handle the expired subscriptions
self.addEventListener('pushsubscriptionchange', function() {
  // subscription expired, let's try to subscribe again
  console.log('Subscription expired');
  self.registration.pushManager.subscribe({ userVisibleOnly: true })
    .then(function(subscription) {
      console.log('Subscribed after expiration', subscription.endpoint);
      // register new subscription in the application server
      return fetch('register', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });
    });
});
