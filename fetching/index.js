// [Working example](/serviceworker-cookbook/fetching/).

// These URLs will be loaded several times
// * `https-acao` SSL protocol with the `Access-Control-Allow-Origin=*` header
// * `https` SSL protocol without allow origin header
// * `http` non-cryptographic protocol
var urls = {
  'https-acao': 'https://mozorg.cdn.mozilla.net/media/img/styleguide/identity/mozilla/wordmark.b9f1818e8d92.png',
  'https': 'https://static.squarespace.com/static/52d66949e4b0a8cec3bcdd46/t/52ebf67fe4b0f4af2a4502d8/1391195777839/1500w/Hello%20Internet.003.png',
  'http': 'http://piotr.zalewa.info/downloads/mozilla.png'
};

// There are two modes of fetching remote resources with or without
// [cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).
// This demo is using both of them.
var fetchModes = ['cors', 'no-cors'];

// Checking if service worker is registered. If it's not, register it
// and reload the page to be sure the client is under service worker's control.
navigator.serviceWorker.getRegistration().then(function(registration) {
  if (!registration || !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('./service-worker.js').then(function() {
      console.log('Service worker registered, reloading the page');
      window.location.reload();
    });
  } else {
    console.log('DEBUG: client is under the control of service worker');
    proceed();
  }
});

// Make and run request for every url from `urls` and every
// mode from `fetchModes`. Create a DOM Image element with each url.
function proceed() {
  for (var protocol in urls) {
    if (urls.hasOwnProperty(protocol)) {
      makeImage(protocol, urls[protocol]);
      for (var index = 0; index < fetchModes.length; index++) {
        var fetchMode = fetchModes[index];
        var init = { method: 'GET',
                     mode: fetchMode,
                     cache: 'default' };
        makeRequest(fetchMode, protocol, init)();
      }
    }
  }
}

// Create a DOM element. This leaves the url handling to the browser.
// JavaScript has no control over it.
function makeImage(protocol, url) {
  var section = 'img-' + protocol;
  var image = document.createElement('img');
  image.src = url;
  document.getElementById(section).appendChild(image);
}

// Create a request
function makeRequest(fetchMode, protocol, init) {
  return function() {
    var section = protocol + '-' + fetchMode;
    var url = urls[protocol];
    // Fetch the resource directly from remote resource
    fetch(url, init).then(function(response) {
      fetchSuccess(response, url, section);
    }).catch(function(error) {
      fetchCatch(error, url, section);
    });
    // Fetch the resource using a proxy created in service worker.
    // Client recognizes it as a local resource
    fetch('./cookbook-proxy/' + url, init).then(function(response) {
      fetchSuccess(response, './cookbook-proxy/' + url, 'proxy-' + section);
    }).catch(function(error) {
      fetchCatch(error, './cookbook-proxy/' + url, 'proxy-' + section);
    });
  };
}

// Logging responses to the DOM
function fetchSuccess(response, url, section) {
  if (response.ok) {
    console.log(section, 'SUCCESS: ', url, response);
    log(section, 'SUCCESS');
  } else {
    console.log(section, 'FAIL:', url, response);
    log(section, 'FAIL: response type: ' + response.type +
                 ', response status: ' + response.status, 'error');
  }
}

function fetchCatch(error, url, section) {
  console.log(section, 'ERROR: ', url, error);
  log(section, 'ERROR: ' + error, 'error');
}

function log(section, message, type) {
  var sectionElement = document.getElementById(section);
  var logElement = document.createElement('p');
  if (type) {
    logElement.classList.add(type);
  }
  logElement.textContent = message;
  sectionElement.appendChild(logElement);
}
