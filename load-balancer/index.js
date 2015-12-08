// A convenient shortcut for `document.querySelector()`
var $ = document.querySelector.bind(document); // eslint-disable-line id-length

// Register the worker and enable image selection.
if (navigator.serviceWorker.controller) {
  enableImgSelector();
} else {
  navigator.serviceWorker.register('service-worker.js');
  navigator.serviceWorker.ready.then(enableImgSelector);
}

function enableImgSelector() {
  $('#image-selector').disabled = false;
}

// When clicking configure button, send the load values to the back-end to
// simulate server loads.
$('#load-configuration').onsubmit = function(event) {
  // Avoid navigation
  event.preventDefault();

  // Get sever load levels.
  var loads = [
    $('#load-1').value,
    $('#load-2').value,
    $('#load-3').value
  ].map(function(item) {
    return parseInt(item, 10);
  });

  // Send the request to configure the load levels serializing the body
  // and setting the content type header properly.
  fetch(addSession('./server-loads'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loads)
  });
};

$('#image-selector').onchange = function() {
  var imgUrl = $('select').value;
  if (imgUrl) {
    $('img').src = addSession(imgUrl);

    // Specifically for the cookbook :(
    $('img').onload = function() {
      if (window.parent !== window) {
        window.parent.dispatchEvent(new CustomEvent('iframeresize'));
      }
    };
  }
};

// Add the session parameter to an URL
function addSession(url) {
  return url + '?session=' + getSession();
}

// A simple session manager based on a random string stored in the localStorage
function getSession() {
  var session = localStorage.getItem('session');
  if (!session) {
    session = '' + Date.now() + '-' + Math.random();
    localStorage.setItem('session', session);
  }
  return session;
}
