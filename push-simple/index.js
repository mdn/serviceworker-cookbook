navigator.serviceWorker.register('service-worker.js').then(function(registration) {
  return registration.pushManager.getSubscription().then(function(subscription) {
    if (!subscription) {
      return registration.pushManager.subscribe({ userVisibleOnly: true }).then(function(subscription) {
        return subscription;
      });
    } else {
      return subscription;
    }
  });
}).then(function(subscription) {
  fetch('./register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    }),
  });
});

document.getElementById('doIt').onclick = function() {
  fetch('./sendNotification', {
    method: 'post',
  });
}
