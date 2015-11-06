navigator.serviceWorker.register('service-worker.js').then(function(registration) {
  return registration.pushManager.getSubscription().then(function(subscription) {
    if (subscription) {
      return subscription;
    }

    return registration.pushManager.subscribe({ userVisibleOnly: true }).then(function(newSubscription) {
      return newSubscription;
    });
  });
}).then(function(subscription) {
  var key = subscription.getKey ? subscription.getKey('p256dh') : '';

  fetch('./register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
    }),
  });
});

document.getElementById('doIt').onclick = function() {
  var notificationPayload = document.getElementById('notification-payload').value;
  var notificationDelay = document.getElementById('notification-delay').value;
  var notificationTTL = document.getElementById('notification-ttl').value;

  fetch('./sendNotification?payload=' + notificationPayload + '&delay=' + notificationDelay + '&ttl=' + notificationTTL, {
    method: 'post',
  });
};
