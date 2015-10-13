var dataUrl = 'https://api.github.com/events';
var cacheDelayInput = document.getElementById('cache-delay');
var cacheFailInput = document.getElementById('cache-fail');
var networkDelayInput = document.getElementById('network-delay');
var networkFailInput = document.getElementById('network-fail');
var cacheStatus = document.getElementById('cache-status');
var networkStatus = document.getElementById('network-status');
var getDataButton = document.getElementById('getDataButton');
var dataElement = document.getElementById('data');

var cacheName = 'cache-then-network';
var gotNetworkData = false;

if (navigator.serviceWorker.controller) {
  console.log('SW already registered');
} else {
  console.log('registering SW');
  navigator.serviceWorker.register('sw.js', {
    scope: './',
  }).then(function handleRegistered() {
    console.log('SW registered');
  });
}

function reset() {
  dataElement.textContent = '';
  cacheStatus.textContent = '';
  networkStatus.textContent = '';
  gotNetworkData = false;
}

function startTransferUI() {
  getDataButton.disabled = true;
  cacheDelayInput.disabled = true;
  cacheFailInput.disabled = true;
  networkDelayInput.disabled = true;
  networkFailInput.disabled = true;
  reset();
}

function stopTransferUI() {
  getDataButton.disabled = false;
  cacheDelayInput.disabled = false;
  cacheFailInput.disabled = false;
  networkDelayInput.disabled = false;
  networkFailInput.disabled = false;
}

function handleFetchCompletion(res) {
  var shouldNetworkError = networkFailInput.checked;
  if (shouldNetworkError) {
    throw new Error('Network error on purpose');
  }

  res.json().then(function(data) {
    updatePage(data);
    gotNetworkData = true;
  });
}

function handleCacheFetchCompletion(res) {
  var shouldCacheError = cacheFailInput.checked;
  if (shouldCacheError || !res) {
    throw Error('Cache miss');
  }

  res.json().then(function(data) {
    if (!gotNetworkData) {
      updatePage(data);
    }
  });
}

function updatePage(data) {
  dataElement.textContent = 'User ' + data[0].actor.login + ' modified repo ' + data[0].repo.name;
}

getDataButton.addEventListener('click', function handleClick() {
  startTransferUI();

  // Initiate network fetch
  networkStatus.textContent = 'Fetching...';
  var networkFetch = fetch(dataUrl, { mode: 'cors', cache: 'no-cache' }).then(function(res) {
    var networkDelay = networkDelayInput.value || 0;

    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        try {
          handleFetchCompletion(res);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, networkDelay);
    });
  }).then(function() {
    networkStatus.textContent = 'Success';
  }).catch(function(err) {
    networkStatus.textContent = err;
  });

  // Get cached data
  cacheStatus.textContent = 'Fetching...';
  var cacheFetch = caches.open(cacheName).then(function(cache) {
    return cache.match(dataUrl).then(function(res) {
      var cacheDelay = cacheDelayInput.value || 0;

      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          try {
            handleCacheFetchCompletion(res);
            resolve();
          } catch (err) {
            reject(err);
          }
        }, cacheDelay);
      });
    }).then(function() {
      cacheStatus.textContent = 'Success';
    }).catch(function(err) {
      cacheStatus.textContent = err;
    });
  });

  Promise.all([networkFetch, cacheFetch]).then(stopTransferUI);
});
