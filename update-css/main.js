var metaCacheName = 'update-css-meta-cache';
var currentKey = 'current';
var currentJSONKey = 'currentJSON';

navigator.serviceWorker.register('sw.js');

var currents = [
  { id: 0, filenames: ['style-0.css'] },
  { id: 1, filenames: ['style-1.css'] },
];

var isUpdatingUI = false;
function updateUI() {
  if (isUpdatingUI) {
    return;
  }

  isUpdatingUI = true;

  getServerVersion().then(function(version) {
    document.querySelector('#newest-version').textContent = version;
  });

  getCurrentVersion().then(function(version) {
    document.querySelector('#displayed-version').textContent = version;
  });
}

window.addEventListener('load', function() {
  updateUI();
});

window.addEventListener('message', function(event) {
  if (!event.data) {
    return;
  }

  if (event.data.msg === 'toggleVersion') {
    updateUI();
  }
});

function getCurrentVersion() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentKey);
  }).then(function(response) {
    if (!response || !response.ok || !response.text) {
      return null;
    }

    return response.text();
  });
}

function getServerVersion() {
  return caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentJSONKey);
  }).then(function(res) {
    if (!res || !res.ok || !res.json) {
      return 'No version';
    }
    return res.json().then(function(json) {
      return json.id;
    });
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
  caches.open(metaCacheName).then(function(cache) {
    return cache.match(currentJSONKey).then(function(response) {
      if (!response || !response.ok || !response.json) {
        var json = JSON.stringify(currents[0]);
        return cache.put(currentJSONKey,
                         new Response(json,
                                      { 'status': 200 }));
      }

      return response.json().then(function(resJSON) {
        var id = (resJSON.id + 1) % currents.length;
        var newJSON = JSON.stringify(currents[id]);
        return cache.put(currentJSONKey,
                         new Response(newJSON,
                                      { 'status': 200 }));
      });
    });
  }).then(function() {
    window.postMessage({ msg: 'toggleVersion' }, '*');
    toggleVersionButton.disabled = false;
  });
});
