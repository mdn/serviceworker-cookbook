var CACHE_NAME = 'notifications';

// On install, create the 'notifications' cache that will be used to store the Number
// of notifications received.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all([
        // We create a fake request and response to store the info.
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
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim);
});

function updateNumber(type) {
  // Update the number of notifications received of type 'type' (visible or invisible).
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(type).then(function(response) {
      return response.json().then(function(notificationNum) {
        var newNotificationNum = notificationNum + 1;

        return cache.put(
          new Request(type),
          new Response(JSON.stringify(newNotificationNum), {
            headers: {
              'content-type': 'application/json',
            },
          })
        ).then(function() {
          return newNotificationNum;
        });
      });
    });
  });
}

// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Retrieve the payload from event.data (a PushMessageData object) as a JSON object.
  var visible = event.data ? event.data.json() : false;

  // Keep the service worker alive until the 'notifications' cache is updated and,
  // if visible is true, the notification is created.

  if (visible) {
    event.waitUntil(updateNumber('visible').then(function(num) {
      return self.registration.showNotification('ServiceWorker Cookbook', {
        body: 'Received ' + num + ' visible notifications',
      });
    }));
  } else {
    event.waitUntil(updateNumber('invisible'));
  }
});
