// This function simulates a simple interface update code, that reflects
// the current state in the UI, updating an image and a version number.
function fetchUpdate() {
  var img = document.querySelector('#random');
  img.src = img.src = 'random.jpg?' + Date.now();
  fetch('./version').then(function(response) {
    return response.text();
  }).then(function(text) {
    debug(text, 'version');
  });
}

// A ServiceWorker controls the site on load and therefor can handle offline
// fallbacks.
if (navigator.serviceWorker.controller) {
  var url = navigator.serviceWorker.controller.scriptURL;
  console.log('serviceWorker.controller', url);
  debug(url, 'onload');
  fetchUpdate();
} else {
  // Register the ServiceWorker
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  }).then(function(registration) {
    debug('Refresh to allow ServiceWorker to control this client', 'onload');
    debug(registration.scope, 'register');
  });
}

navigator.serviceWorker.addEventListener('controllerchange', function() {
  var scriptURL = navigator.serviceWorker.controller.scriptURL;
  console.log('serviceWorker.onControllerchange', scriptURL);
  debug(scriptURL, 'oncontrollerchange');
  fetchUpdate();
});

document.querySelector('#update').addEventListener('click', function() {
  navigator.serviceWorker.ready.then(function(registration) {
    registration.update().then(function() {
      console.log('Checked for update');
    }).catch(function(error) {
      console.error('Update failed', error);
    });
  });
});

function debug(message, element) {
  var target = document.querySelector('#' + element || 'log');
  target.textContent = message;
}
