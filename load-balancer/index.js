// A convenient shortcut for `document.querySelector()`
var $ = document.querySelector.bind(document); // eslint-disable-line id-length

var serverLoadInputs = [
  $('#load-1'),
  $('#load-2'),
  $('#load-3')
];

// Register the worker and enable image selection.
navigator.serviceWorker.register('service-worker.js');
navigator.serviceWorker.ready.then(enableUI);

function enableUI() {
  getServerLoads().then(function(loads) {
    serverLoadInputs.forEach(function(input, index) {
      input.value = loads[index];
      input.disabled = false;
    });
    $('#image-selector').disabled = false;
  });
}

function getServerLoads() {
  return fetch(addSession('./server-loads/')).then(function(response) {
    return response.json();
  });
}

// When _clicking_ configure button, send the load values to the back-end to
// simulate server loads.
$('#load-configuration').onsubmit = function(event) {
  // Avoid navigation
  event.preventDefault();

  // Get fake levels from inputs.
  var loads = serverLoadInputs.map(function(input) {
    return parseInt(input.value, 10);
  });

  // Send the request to configure the load levels serializing the body
  // and setting the content type header properly.
  fetch(addSession('./server-loads'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loads)
  }).then(function(response) {
    return response.json();
  }).then(function(result) {
    $('#loads-label').textContent = result;
  });
};

// Simply change the source for the image.
$('#image-selector').onchange = function() {
  var imgUrl = $('select').value;
  if (imgUrl) {
    // The bumping parameter `_b` is just to avoid HTTP cache.
    $('img').src = addSession(imgUrl) + '&_b=' + Date.now();

    // Specifically for the cookbook :(
    $('img').onload = function() {
      if (window.parent !== window) {
        window.parent
          .document.body.dispatchEvent(new CustomEvent('iframeresize'));
      }
    };
  }
};

// Add the session parameter to an URL.
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
