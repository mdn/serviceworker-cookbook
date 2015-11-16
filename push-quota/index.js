navigator.serviceWorker.register('service-worker.js').then(function(registration) {
  return registration.pushManager.getSubscription().then(function(subscription) {
    if (subscription) {
      return subscription;
    }

    return registration.pushManager.subscribe().then(function(newSubscription) {
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

function askForNotifications(visible) {
  var notificationNum = document.getElementById('notification-num').value;

  fetch('./sendNotification?visible=' + visible + '&num=' + notificationNum, {
    method: 'post',
  });
}

document.getElementById('visible').onclick = function() {
  askForNotifications(true);
};

document.getElementById('invisible').onclick = function() {
  askForNotifications(false);
};

document.getElementById('clear').onclick = function() {
  window.caches.open('notifications').then(function(cache) {
    Promise.all([
      cache.put(new Request('invisible'), new Response('0', {
        headers: {
          'content-type': 'application/json'
        }
      })),
      cache.put(new Request('visible'), new Response('0', {
        headers: {
          'content-type': 'application/json'
        }
      })),
    ]).then(function() {
      updateNumbers();
    });
  });
};

function updateNumbers() {
  window.caches.open('notifications').then(function(cache) {
    ['visible', 'invisible'].forEach(function(type) {
      cache.match(type).then(function(response) {
        response.text().then(function(text) {
          document.getElementById('sent-' + type).textContent = text;
        });
      });
    });
  });
}

window.onload = function() {
  updateNumbers();
  setInterval(updateNumbers, 1000);
};
