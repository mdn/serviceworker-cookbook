var CACHE_NAME = 'notifications';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all([
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
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(type).then(function(response) {
      return response.json().then(function(notificationNum) {
        notificationNum++;

        return cache.put(new Request(type), new Response(JSON.stringify(notificationNum), {
          headers: {
            'content-type': 'application/json'
          }
        })).then(function() {
          return notificationNum;
        });
      });
    });
  });
}

function getNumber(type) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(type).then(function(response) {
      return response.json().then(function(notificationNum) {
        return notificationNum;
      });
    });
  });
}

self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : false;

  if (data) {
    event.waitUntil(updateNumber('visible').then(function(num) {
      return self.registration.showNotification('ServiceWorker Cookbook', {
        body: 'Received ' + num + ' visible notifications',
      });
    }));
  } else {
    event.waitUntil(updateNumber('invisible'));
  }
});
