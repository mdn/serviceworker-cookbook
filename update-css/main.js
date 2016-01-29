navigator.serviceWorker.register('sw.js');

function log(msg) {
  console.log('|page| ' + msg);
}

navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data.msg === 'cacheUpdated') {
    log('SW tells us that an update is available');
    document.querySelector('#status').textContent = 'SW says an update is available!';
  }
});

var toggleVersionButton = document.querySelector('#toggleVersionButton');
var toggleVersionButtonOutput = document.querySelector('#toggleVersionButtonOutput');
toggleVersionButton.addEventListener('click', function() {
  toggleVersionButton.disabled = true;

  log('posting to server telling it to make new resources available');

  // Post to server. Server will simulate resource update
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function() {
    log('posted to server, response received');
  });
  xhr.open('POST', 'update-resources');
  xhr.send();

  toggleVersionButtonOutput.textContent = 'Refresh to see update behavior';
});
