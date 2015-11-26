// [Working example](/serviceworker-cookbook/fetching/).

var urls = {
  'https-acao': 'https://mozorg.cdn.mozilla.net/media/img/styleguide/identity/mozilla/wordmark.b9f1818e8d92.png',
  'https': 'https://static.squarespace.com/static/52d66949e4b0a8cec3bcdd46/t/52ebf67fe4b0f4af2a4502d8/1391195777839/1500w/Hello%20Internet.003.png',
  'http': 'http://piotr.zalewa.info/downloads/mozilla.png'
};

var fetchMethods = ['cors', 'no-cors'];

navigator.serviceWorker.getRegistration().then(function(registration) {
  console.log(registration, navigator.serviceWorker.controller);
  if (!registration || !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('./service-worker.js').then(function() {
      /* eslint no-alert: 0 */
      window.alert('Service worker registered, reloading the page');
      window.location.reload();
    });
  } else {
    console.log('DEBUG: client is under the control of service worker');
    proceed();
  }
});

function proceed() {
  for (var protocol in urls) {
    if (urls.hasOwnProperty(protocol)) {
      makeImage(protocol, urls[protocol]);
      for (var index = 0; index < fetchMethods.length; index++) {
        var fetchMethod = fetchMethods[index];
        var headers = new Headers();
        var init = { method: 'GET',
                     headers: headers,
                     mode: fetchMethod,
                     cache: 'default' };
        makeRequest(fetchMethod, protocol, init)();
      }
    }
  }
}

function makeImage(protocol, url) {
  // DOM Element request
  var section = 'img-' + protocol;
  var image = document.createElement('img');
  image.src = url;
  document.getElementById(section).appendChild(image);
}

function fetchSuccess(response, url, section) {
  if (response.ok) {
    console.log(section, 'SUCCESS: ', url, response);
    log(section, 'SUCCESS');
  } else {
    console.log(section, 'FAIL:', url, response);
    log(
      section,
      'FAIL: response type: ' + response.type,
      'response status: ' + response.status,
      'error'
    );
  }
}

function fetchCatch(error, url, section) {
  console.log(section, 'ERROR: ', url, error);
  log(section, 'ERROR: ' + error, 'error');
}

function makeRequest(fetchMethod, protocol, init) {
  return function() {
    // javascript request
    var section = protocol + '-' + fetchMethod;
    var url = urls[protocol];
    // standard fetch
    fetch(url, init).then(function(response) {
      fetchSuccess(response, url, section);
    }).catch(function(error) {
      fetchCatch(error, url, section);
    });
    // proxied fetch
    fetch('./cookbook-proxy/' + url, init).then(function(response) {
      fetchSuccess(response, './cookbook-proxy/' + url, 'proxy-' + section);
    }).catch(function(error) {
      fetchCatch(error, './cookbook-proxy/' + url, 'proxy-' + section);
    });
  };
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
