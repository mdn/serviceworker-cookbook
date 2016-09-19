var CACHE = 'cache-update-and-refresh';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.onmessage = function (evt) {
    var message = JSON.parse(evt.data);

    var isRefresh = message.type === 'refresh';
    var isAsset = message.url.includes('asset');
    var lastETag = localStorage.currentETag;

    // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) header usually contains
    // the hash of the resource so it is a very effective way of check for fresh
    // content.
    var isNew =  lastETag !== message.eTag;

    if (isRefresh && isAsset && isNew) {
      // Escape the first time (when there is no ETag yet)
      if (lastETag) {
        // Inform the user about the update
        notice.hidden = false;
      }
      // For teaching purposes, although this information is in the offline
      // cache and it could be retrieved from the service worker, keeping track
      // of the header in the `localStorage` keeps the implementation simple.
      localStorage.currentETag = message.eTag;
    }
  };

  var notice = document.querySelector('#update-notice');

  var update = document.querySelector('#update');
  update.onclick = function (evt) {
    var img = document.querySelector('img');
    // Avoid navigation.
    evt.preventDefault();
    // Open the proper cache.
    caches.open(CACHE)
    // Get the updated response.
    .then(function (cache) {
      return cache.match(img.src);
    })
    // Extract the body as a blob.
    .then(function (response) {
      return response.blob();
    })
    // Update the image content.
    .then(function (bodyBlob) {
      var url = URL.createObjectURL(bodyBlob);
      img.src = url;
      notice.hidden = true;
    });
  };
}
