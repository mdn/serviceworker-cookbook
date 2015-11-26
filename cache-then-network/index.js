var dataUrl = 'https://api.github.com/events';
var cacheDelayInput = document.getElementById('cache-delay');
var cacheFailInput = document.getElementById('cache-fail');
var networkDelayInput = document.getElementById('network-delay');
var networkFailInput = document.getElementById('network-fail');
var cacheStatus = document.getElementById('cache-status');
var networkStatus = document.getElementById('network-status');
var getDataButton = document.getElementById('getDataButton');
var dataElement = document.getElementById('data');

/*
 * Caches are per-origin, so we need to pick a name that no
 * other page on this origin is going to try to use.
 */
var cacheName = 'cache-then-network';


/*
 * If network data was received, we don't want an in-flight cache
 * fetch to complete and overwrite the data that we just got from
 * the network. We use this flag to let the cache fetch callbacks
 * know whether a network fetch has already completed.
 */
var gotNetworkData = false;


/*
 * For showing elapsed times
 */
var networkFetchStartTime;
var cacheFetchStartTime;


/*
 * UI functions
 */
function reset() {
  dataElement.textContent = '';
  cacheStatus.textContent = '';
  networkStatus.textContent = '';
  gotNetworkData = false;
}

function disableUI() {
  getDataButton.disabled = true;
  cacheDelayInput.disabled = true;
  cacheFailInput.disabled = true;
  networkDelayInput.disabled = true;
  networkFailInput.disabled = true;
  reset();
}

function enableUI() {
  getDataButton.disabled = false;
  cacheDelayInput.disabled = false;
  cacheFailInput.disabled = false;
  networkDelayInput.disabled = false;
  networkFailInput.disabled = false;
}

function updatePage(data) {
  dataElement.textContent = 'User ' + data[0].actor.login +
                            ' modified repo ' + data[0].repo.name;
}


/*
 * Callbacks for network and cache fetches
 */
function handleFetchCompletion(res) {
  // Simulate a network error by throwing in the callback
  var shouldNetworkError = networkFailInput.checked;
  if (shouldNetworkError) {
    throw new Error('Network error');
  }

  // We have to clone the response here because request bodies
  // can only be read once. Placing a response in the cache
  // counts as a read and so does the `res.json` call below.
  var resClone = res.clone();
  caches.open(cacheName).then(function(cache) {
    // Cache the response so that subsequent cache fetches
    // will find this updated data.
    cache.put(dataUrl, resClone);
  });

  // Read the response as json
  res.json().then(function(data) {
    updatePage(data);
    // Make sure that any in-flight cache requests don't
    // overwrite the information that we just received.
    gotNetworkData = true;
  });
}

function handleCacheFetchCompletion(res) {
  var shouldCacheError = cacheFailInput.checked;
  if (shouldCacheError || !res) {
    throw Error('Cache miss');
  }

  // Read the response as json
  res.json().then(function(data) {
    // Only update the page if the network request hasn't
    // already returned. Otherwise we'd be overwriting the
    // data we just pulled from the network.
    if (!gotNetworkData) {
      updatePage(data);
    }
  });
}


/*
 * This is the heart of the demo. Whenever the user clicks the
 * button, we'll make simultaneous (or nearly-simultaneous) requests
 * of the cache and the network for data. In a real application, this
 * would probably happen on page load rather than as a result of
 * user action, but to make the page more illustrative and allow
 * for user-specified delays, we've got a button.
 */
getDataButton.addEventListener('click', function handleClick() {
  disableUI();

  // Initiate network fetch
  networkStatus.textContent = 'Fetching...';
  networkFetchStartTime = Date.now();

  // Use the Fetch API to actually request data
  //
  // It should not be necessary to use a cache busting URL param
  // because we're using the 'no-cache' caching option in the fetch
  // call, but those caching options are not yet implemented
  // in Firefox or Chrome. See bug 1120715 for the Firefox
  // implementation status.
  var cacheBuster = Date.now();
  var networkFetch = fetch(dataUrl + '?cacheBuster=' + cacheBuster, {
    mode: 'cors',
    cache: 'no-cache',
  }).then(function(res) {
    var networkDelay = networkDelayInput.value || 0;

    // We simulate network delays by waiting before actually calling
    // our network fetch callback. If the callback errors, we want
    // to make sure to reject the Promise we got from the original
    // fetch.
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
    var now = Date.now();
    var elapsed = now - networkFetchStartTime;
    networkStatus.textContent = 'Success after ' + elapsed + 'ms';
  }).catch(function(err) {
    var now = Date.now();
    var elapsed = now - networkFetchStartTime;
    networkStatus.textContent = err + ' after ' + elapsed + 'ms';
  });

  // Get cached data
  cacheStatus.textContent = 'Fetching...';
  cacheFetchStartTime = Date.now();
  var cacheFetch = caches.open(cacheName).then(function(cache) {
    return cache.match(dataUrl).then(function(res) {
      var cacheDelay = cacheDelayInput.value || 0;

      // We simulate cache delays by waiting before actually calling
      // our cache fetch callback. If the callback errors, we want
      // to make sure to reject the Promise we got from the original
      // call to `match`.
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
      var now = Date.now();
      var elapsed = now - cacheFetchStartTime;
      cacheStatus.textContent = 'Success after ' + elapsed + 'ms';
    }).catch(function(err) {
      var now = Date.now();
      var elapsed = now - cacheFetchStartTime;
      cacheStatus.textContent = err + ' after ' + elapsed + 'ms';
    });
  });

  Promise.all([networkFetch, cacheFetch]).then(enableUI);
});
