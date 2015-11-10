self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : 'no payload';

  event.waitUntil(self.registration.showNotification('ServiceWorker Cookbook', {
    body: payload,
  }));
});
