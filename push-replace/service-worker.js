let num = 1;

// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body containing
    // a number that keeps increasing for each received notification.
    // The tag field allows replacing an old notification with a new one (a notification
    // with the same tag of another one will replace it).
    self.registration.showNotification('ServiceWorker Cookbook', {
      body: 'Notification ' + num++,
      tag: 'swc',
    })
  );
});
