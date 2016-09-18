// Register the ServiceWorker
navigator.serviceWorker.register('service-worker.js', {
  scope: './controlled'
}).then(function(registration) {
  console.log('The service worker has been registered ', registration);
});

var referenceIframe = document.getElementById('reference');
var sampleIframe = document.getElementById('sample');
referenceIframe.onload = fixHeight;
sampleIframe.onload = fixHeight;

var reloadButton = document.querySelector('#reload');
reloadButton.onclick = reload;

function reload() {
  referenceIframe.contentWindow.location.reload();
  sampleIframe.contentWindow.location.reload();
}

function fixHeight(evt) {
  var iframe = evt.target;
  var document = iframe.contentWindow.document.documentElement;
  iframe.style.height = document.getClientRects()[0].height + 'px';
  // Specifically for the cookbook site :(
  if (window.parent !== window) {
    window.parent.document.body.dispatchEvent(new CustomEvent('iframeresize'));
  }
}
