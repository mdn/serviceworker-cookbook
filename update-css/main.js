var cachePrefix = 'update-css-';
var metaCacheName = cachePrefix + 'meta-cache';
var currentKey = 'current';

navigator.serviceWorker.register('sw.js');

var isUpdatingUI = false;
function updateUI() {
  if (isUpdatingUI) {
    return;
  }

  isUpdatingUI = true;

  Promise.all([getServerVersion(), getCurrentVersion()]).then(function(vals) {
    document.querySelector('#newest-version').textContent = vals[0];
    document.querySelector('#displayed-version').textContent = vals[1];
    isUpdatingUI = false;
  });
}

window.addEventListener('load', function() {
  updateUI();
});

window.addEventListener('message', function(event) {
  if (!event.data || !event.data.msg) {
    return;
  }

  if (event.data.msg === 'cacheUpdated') {
    updateUI();
  }
});

function getCurrentVersion() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentKey);
  }).then(function(response) {
    if (!response || !response.ok || !response.text) {
      return 'no cached version';
    }

    return response.text();
  });
}

var currentJSONKey = 'currentJSON';
function getServerVersion() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentJSONKey);
  }).then(function(res) {
    if (!res || !res.ok || !res.json) {
      return cachePrefix + '0';
    }
    return res.json().then(function(json) {
      return cachePrefix + json.id;
    });
  });
}

navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data.msg === 'cacheUpdated') {
    document.querySelector('#updated').textContent =
      'SW informs us there is a new version available!';
  }

  if (event.data.msg === 'currentJSONUpdated') {
    updateUI();
  }
});

var toggleVersionButton = document.querySelector('#toggleVersionButton');
toggleVersionButton.addEventListener('click', function() {
  navigator.serviceWorker.controller.postMessage({ msg: 'toggleVersion' });
});
