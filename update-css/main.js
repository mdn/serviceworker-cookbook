navigator.serviceWorker.register('sw.js');

navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data.msg === 'cacheUpdated') {
    document.querySelector('#status').textContent = 'SW says an update is available!';
  }
});

var toggleVersionButton = document.querySelector('#toggleVersionButton');
var toggleVersionButtonOutput = document.querySelector('#toggleVersionButtonOutput');
toggleVersionButton.addEventListener('click', function() {
  toggleVersionButton.disabled = true;
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ msg: 'toggleVersion' });
    toggleVersionButtonOutput.textContent = 'Refresh to see update behavior';
    return;
  }
  toggleVersionButtonOutput.textContent = 'No SW connected, unable to update';
  return;
});
