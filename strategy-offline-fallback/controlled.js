// To be able to provide fallbacks since the beginning we can only load the
// image once we know the SW is ready. In addition, the SW should start
// intercepting ASAP.
if (navigator.serviceWorker.controller) {
  loadImage();
} else {
  navigator.serviceWorker.oncontrollerchange = function() {
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
