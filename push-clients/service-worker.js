self.addEventListener('push', function(event) {
  event.waitUntil(clients.matchAll().then(function(clientList) {
    var focused = false;
    for (var i = 0; i < clientList.length; i++) {
      if (clientList[i].focused) {
        focused = true;
        break;
      }
    }

    var notificationMessage;
    if (focused) {
      notificationMessage = 'You\'re still here, thanks!';
    } else if (clientList.length > 0) {
      notificationMessage = 'You haven\'t closed the page, click here to focus it!';
    } else {
      notificationMessage = 'You have closed the page, click here to re-open it!';
    }

    return self.registration.showNotification('ServiceWorker Cookbook', {
      body: notificationMessage,
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
