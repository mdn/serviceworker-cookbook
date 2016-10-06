// Register the ServiceWorker limiting its action to those URLs starting
// by `controlled`. The scope is not a path but a prefix. First, it is
// converted into an absolute URL, then used to determine if a page is
// controlled by testing it is a prefix of the request URL.
navigator.serviceWorker.register('service-worker.js', {
  scope: './controlled'
});

// Load controlled and uncontrolled pages once the worker is active.
navigator.serviceWorker.ready.then(reload);

var referenceIframe = document.getElementById('reference');
var sampleIframe = document.getElementById('sample');

// Fix heights every time the iframe reload.
referenceIframe.onload = fixHeight;
sampleIframe.onload = fixHeight;

// Reload both iframes on demand.
var reloadButton = document.querySelector('#reload');
reloadButton.onclick = reload;

// Loads the controlled and uncontrolled iframes.
function loadIframes() {
  referenceIframe.src = './non-controlled.html';
  sampleIframe.src = './controlled.html';
}

// Compute the correct height for the content of an iframe and adjust it
// to match the content.
function fixHeight(evt) {
  var iframe = evt.target;
  var document = iframe.contentWindow.document.documentElement;
  iframe.style.height = document.getClientRects()[0].height + 'px';
  // Specifically for the cookbook site :(
  if (window.parent !== window) {
    window.parent.document.body.dispatchEvent(new CustomEvent('iframeresize'));
  }
}

// Reload both iframes.
function reload() {
  referenceIframe.contentWindow.location.reload();
  sampleIframe.contentWindow.location.reload();
}
