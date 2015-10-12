// This function simulates a simple interface update code, that reflects
// the current state in the UI, updating an image and a version number.
function updateView() {
  const img = document.querySelector('#random');
  img.src = img.src = `random.jpg?${Date.now()}`;
  fetch('./version').then((response) => {
    return response.text();
  }).then((text) => {
    debug(text, 'version');
  });
}

// A ServiceWorker controls the site on load and therefor can handle offline
// fallbacks.
if (navigator.serviceWorker.controller) {
  const scriptURL = navigator.serviceWorker.controller.scriptURL;
  console.log('serviceWorker.controller', scriptURL);
  debug(scriptURL, 'onload');
  updateView();
} else {
  // Register the ServiceWorker
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  }).then((registration) => {
    debug('Refresh to allow ServiceWorker to control this client', 'onload');
    debug(registration.scope, 'register');
  });
}

navigator.serviceWorker.addEventListener('controllerchange', () => {
  const scriptURL = navigator.serviceWorker.controller.scriptURL;
  console.log('serviceWorker.onControllerchange', scriptURL);
  debug(scriptURL, 'oncontrollerchange');
  updateView();
});

document.querySelector('#update').addEventListener('click', () => {
  navigator.serviceWorker.ready.then((registration) => {
    registration.update().then(() => {
      console.log('Checked for update');
    }).catch((error) => {
      console.error('Update failed', error);
    });
  });
});

function debug(message, element) {
  const target = document.querySelector('#' + element || 'log');
  target.textContent = message;
}
