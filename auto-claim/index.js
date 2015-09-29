// A ServiceWorker controls the site on load and therefor can handle offline
// fallbacks.
if (navigator.serviceWorker.controller) {
  debug(navigator.serviceWorker.controller.scriptURL, 'onload', true);
  console.log('serviceWorker.controller', navigator.serviceWorker.controller);
} else {
  // Register the ServiceWorker
  console.log('serviceWorker.register');
  navigator.serviceWorker.register('service-worker.js', {
    scope: './',
  }).then((registration) => {
    console.log('serviceWorker.register().then', registration.active);
    debug('Refresh to allow ServiceWorker to control this client', 'onload');
    debug(registration.scope, 'register');
  });
}
navigator.serviceWorker.ready.then((registration) => {
  console.log('serviceWorker.ready', registration.active);
});
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('serviceWorker::onControllerchange', navigator.serviceWorker.controller);
  debug(navigator.serviceWorker.controller.scriptURL, 'oncontrollerchange', true);
  updateImage();
});

function updateImage() {
  const img = document.querySelector('#random');
  img.src = img.src.replace(/\?.*|$/, `?${Date.now()}`);
}

document.querySelector('#update').addEventListener('click', () => {
  navigator.serviceWorker.ready.then((registration) => {
    registration.update().then(() => {
      console.log('Updated ServiceWorker');
    }).catch((error) => {
      console.error('Update failed', error);
    });
  });
});

function debug(message, element) {
  const target = document.querySelector('#' + element || 'log');
  target.textContent = message;
}
