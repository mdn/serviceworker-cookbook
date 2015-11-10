self.addEventListener('push', function(event) {
  event.waitUntil(self.registration.showNotification('ServiceWorker Cookbook', {
    lang: 'la',
    body: 'Alea iacta est',
    icon: 'caesar.jpg',
    vibrate: [500, 100, 500],
  }));
});
