// A convenient shortcut for `document.querySelector()`
var $ = document.querySelector.bind(document); // eslint-disable-line id-length

// Check if the application is installed by checking the controller.
// If there is a service worker controlling this page, let's assume
// the application is installed.
navigator.serviceWorker.getRegistration().then(function(registration) {
  if (registration && registration.active) {
    showImagesSection();
  }
});

// During installation, once the service worker is active, we shows
// the image dynamic loader.
navigator.serviceWorker.oncontrollerchange = function() {
  if (navigator.serviceWorker.controller) {
    logInstall('The application has been installed');
    showImagesSection();
  }
};

// Install the worker is no more than registering. It is in charge of
// downloading the package, decompress and cache the resources.
$('#install').onclick = function() {
  navigator.serviceWorker.register('worker.js').then(function() {
    logInstall('Installing...');
  }).catch(function(error) {
    logInstall('An error happened during installing the service worker:');
    logInstall(error.message);
  });
};

// Uninstalling the worker is simply unregistering it. Notice this
// wont erase the offline cache so the resources are actually still
// installed but there is no service worker to serve them.
$('#uninstall').onclick = function() {
  navigator.serviceWorker.getRegistration().then(function(registration) {
    if (!registration) { return; }
    registration.unregister()
      .then(function() {
        logUninstall('The application has been uninstalled');
        setTimeout(function() { location.reload(); }, 500);
      })
      .catch(function(error) {
        logUninstall('Error while uninstalling the service worker:');
        logUninstall(error.message);
      });
  });
};

// To load an image is no more than assiging the correct URL to
// the displayer.
$('#load-image').onclick = function() {
  $('img').src = $('select').value;
};

// A bunch of helpers to control the UI.
function showImagesSection() {
  $('#images').hidden = false;
  $('#install-notice').hidden = true;
}

function logInstall(what) {
  log(what, 'Install');
}

function logUninstall(what) {
  log(what, 'Uninstall');
}

function log(what, tag) {
  var label = '[' + tag + ']';
  console.log(label, what);
  $('#results').textContent += label + ' ' + what + '\n';
}
