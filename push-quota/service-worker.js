self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : null;

  if (!data) {
    console.log('No data received');
    return;
  }

  if (data.visible) {
    event.waitUntil(self.registration.showNotification('ServiceWorker Cookbook', {
      body: 'Received ' + data.num + ' visible notifications',
    }));
  } else {
    console.log('Received ' + data.num + ' invisible notifications');
  }
});
