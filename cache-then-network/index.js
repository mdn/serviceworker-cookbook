const dataUrl = 'https://api.github.com/events';
const cacheDelayInput = document.getElementById('cache-delay');
const cacheFailInput = document.getElementById('cache-fail');
const networkDelayInput = document.getElementById('network-delay');
const networkFailInput = document.getElementById('network-fail');
const cacheStatus = document.getElementById('cache-status');
const networkStatus = document.getElementById('network-status');
const getDataButton = document.getElementById('getDataButton');
const dataElement = document.getElementById('data');

const cacheName = 'cache-then-network';
let gotNetworkData = false;

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
  const shouldNetworkError = networkFailInput.checked;
  if (shouldNetworkError) {
    throw new Error('Network error on purpose');
  }

  res.json().then((data) => {
    updatePage(data);
    gotNetworkData = true;
  });
}

function handleCacheFetchCompletion(res) {
  const shouldCacheError = cacheFailInput.checked;
  if (shouldCacheError || !res) {
    throw Error('Cache miss');
  }

  res.json().then((data) => {
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
  const networkFetch = fetch(dataUrl, { mode: 'cors', cache: 'no-cache' }).then((res) => {
    const networkDelay = networkDelayInput.value || 0;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          handleFetchCompletion(res);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, networkDelay);
    });
  }).then(() => {
    networkStatus.textContent = 'Success';
  }).catch((err) => {
    networkStatus.textContent = err;
  });

  // Get cached data
  cacheStatus.textContent = 'Fetching...';
  const cacheFetch = caches.open(cacheName).then((cache) => {
    return cache.match(dataUrl).then((res) => {
      const cacheDelay = cacheDelayInput.value || 0;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            handleCacheFetchCompletion(res);
            resolve();
          } catch (err) {
            reject(err);
          }
        }, cacheDelay);
      });
    }).then(() => {
      cacheStatus.textContent = 'Success';
    }).catch((err) => {
      cacheStatus.textContent = err;
    });
  });

  Promise.all([networkFetch, cacheFetch]).then(stopTransferUI);
});
