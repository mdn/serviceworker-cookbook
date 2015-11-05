self.addEventListener('push', function(event) {
  event.waitUntil(clients.matchAll().then(function(clientList) {
    var focused = false;
    for (var i = 0; i < clientList.length; i++) {
      if (clientList[i].focused) {
        focused = true;
        break;
      }
    }

    return self.registration.showNotification('ServiceWorker Cookbook', {
      body: focused ? 'You\'re still here, thanks!' : 'Click me, please!',
    });
  }));
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(clients.matchAll().then(function(clientList) {
    if (clientList.length > 0) {
      return clientList[0].focus();
    } else {
      return clients.openWindow('./push-clients/index.html');
    }
  }));
});
