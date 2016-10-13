// To be able to provide fallbacks since the beginning, we can only load the
// image once we know the SW is ready. In addition, the service worker should
// start intercepting without waiting for current clients to be closed.

// Checking for controller is an effective way to see if there is an active
// service worker controlling the page.
if (navigator.serviceWorker.controller) {
  loadImage();

// If there is not, wait until there is one...
} else {
  navigator.serviceWorker.oncontrollerchange = function() {
    // ...and monitor it until it's ready to intercept requests.
    this.controller.onstatechange = function() {
      if (this.state === 'activated') {
        loadImage();
      }
    };
  };
}

function loadImage() {
  document.querySelector('img').src = './missing';
}
