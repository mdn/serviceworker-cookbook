var cacheName = 'update-css-2015.1015.1202';

window.navigator.serviceWorker.register('sw.js');

window.addEventListener('message', function(ev) {
  console.log('MESSAGE ' + ev.data.msg);

  if (!ev.data) {
    return;
  }

  if (ev.data.msg === 'toggleCSSFilename') {
    document.querySelector('#css-status').textContent = 'The next time this page is loaded, the SW will discover updated CSS on the server after serving the cached CSS';
    return;
  }
});

navigator.serviceWorker.addEventListener('message', function(ev) {
  if (ev.data.msg === 'cssUpdated') {
    console.log('GOT CSS UPDATED');
    if (ev.data.val) {
      document.querySelector('#new-css-msg').textContent = 'The server has a new CSS file available! If you refresh the page you should see updated CSS. In production, a site might decide to automatically refresh at this point';
    } else {
      document.querySelector('#new-css-msg').textContent = 'The latest CSS has been served';
    }

    return;
  }
});

var updateCSSButton = document.querySelector('#updateCSSButton');
updateCSSButton.addEventListener('click', function(ev) {
  updateCSSButton.disabled = true;
  caches.open(cacheName).then(function(cache) {
    cache.match('current-css-filename').then(function(response) {
      var newValue;
      if (response.text) {
        response.text().then(function(value) {
          if (value === 'style-1.css') {
            newValue = 'style-2.css';
          } else {
            newValue = 'style-1.css';
          }
          cache.put('current-css-filename', new Response(newValue, { 'status': 200 }));
          return window.postMessage({ msg: 'toggleCSSFilename' }, '*');
        });
      } else {
        cache.put('current-css-filename', new Response('style-2.css', { 'status': 200 }));
        return window.postMessage({ msg: 'toggleCSSFilename' }, '*');
      }
    });
  });
});
