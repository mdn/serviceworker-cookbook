var num = 1;

self.addEventListener('push', function(event) {
  event.waitUntil(self.registration.showNotification('ServiceWorker Cookbook', {
    body: 'Notification ' + num++,
    tag: 'swc',
  }));
});
