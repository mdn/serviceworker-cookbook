var cacheName = 'update-css-meta-cache';
var simulatedKey = 'simulatedFetch';

navigator.serviceWorker.register('sw.js');

var currents = [
  { id: 0, filenames: ['style-0.css'] },
  { id: 1, filenames: ['style-1.css'] },
];

window.addEventListener('message', function(event) {
  if (!event.data) {
    return;
  }

  if (event.data.msg === 'toggleVersion') {
    getServerVersion().then(function(version) {
      document.querySelector('#newest-version').textContent = version;
    });
  }
});

function getServerVersion() {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(simulatedKey);
  }).then(function(val) {
    return val;
  });
}

navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data.msg === 'cssUpdated') {
    document.querySelector('#updated').textContent =
      'SW informs us there is a new version available!';
  }
});

var toggleVersionButton = document.querySelector('#toggleVersionButton');
toggleVersionButton.addEventListener('click', function() {
  toggleVersionButton.disabled = true;
  caches.open(cacheName).then(function(cache) {
    cache.match(simulatedKey).then(function(response) {
      var newValue;
      if (response.json) {
        response.json().then(function(value) {
          newValue = (value.id + 1) % currents.length;
          cache.put(simulatedKey,
                    new Response(currents[newValue], { 'status': 200 }));
          return window.postMessage({ msg: 'toggleVersion' }, '*');
        });
      } else {
        cache.put(simulatedKey, new Response(currents[0], { 'status': 200 }));
        return window.postMessage({ msg: 'toggleCSSFilename' }, '*');
      }
    });
  });
});
