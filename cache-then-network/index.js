const dataUrl = 'https://api.github.com/events';
const cacheDelayInput = document.getElementById('cache-delay');
const cacheFailInput = document.getElementById('cache-fail');
const networkDelayInput = document.getElementById('network-delay');
const networkFailInput = document.getElementById('network-fail');
const ctx = document.getElementById('retrievedData').getContext('2d');
const getDataButton = document.getElementById('getDataButton');
const dataElement = document.getElementById('data');

if (navigator.serviceWorker.controller) {
  // A ServiceWorker controls the site on load and therefore can handle
  // offline fallbacks.
  console.log('SW exists at ' + navigator.serviceWorker.controller.scriptURL);
  console.log('SW state: ' + navigator.serviceWorker.controller.state);
  navigator.serviceWorker.ready.then(() => {
    console.log('SW ready');
  });
} else {
  // Register the ServiceWorker
  console.log('Registering SW');
  navigator.serviceWorker.register('sw.js', {
    scope: './',
  }).then((reg) => {
    console.log('SW registered, scope=' + reg.scope);
  });
}

function reset() {
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  dataElement.textContent = '';
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

function startResetTimer() {
}

function handleFetchCompletion(res) {
  const shouldNetworkError = networkFailInput.checked;
  if (shouldNetworkError) {
    throw new Error('Network error on purpose');
  }

  console.log('Network fetch complete');
  res.json().then((data) => {
    updatePage(data);
  });
}

function handleCacheFetchCompletion(res) {
  const shouldCacheError = cacheFailInput.checked;
  if (shouldCacheError) {
    throw new Error('Cache error on purpose');
  }

  if (!res) {
    throw Error('Cache miss (not on purpose)');
  }

  console.log('Cache fetch complete');
  res.json().then((data) => {
    updatePage(data);
  });
}

function updatePage(data) {
  dataElement.textContent = 'User ' + data[0].actor.login + ' modified repo ' + data[0].repo.name;
}

getDataButton.addEventListener('click', function handleClick() {
  startTransferUI();

  // Initiate network fetch
  const networkFetch = fetch(dataUrl, { mode: 'cors', cache: 'no-cache' }).then((res) => {
    const networkDelay = networkDelayInput.value || 0;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          handleFetchCompletion(res);
          resolve();
        } catch(e) {
          reject(e);
        }
      }, networkDelay);
    });
  }).catch((err) => {
    console.log('Network failure: ' + err);
  });

  // Get cached data
  const cacheFetch = caches.open(SW.cacheName).then((cache) => {
    return cache.match(dataUrl).then((res) => {
      const cacheDelay = cacheDelayInput.value || 0;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            handleCacheFetchCompletion(res);
            resolve();
          } catch(e) {
            reject(e);
          }
        }, cacheDelay);
      });
    }).catch((err) => {
      console.log('Cache failure: ' + err);
    });
  });

  Promise.all([networkFetch, cacheFetch]).then(stopTransferUI).then(startResetTimer);
});
