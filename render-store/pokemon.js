// Modern browsers prevent mixed content. I.e., if the page is served from
// a safe (https) origin, they will block the content from other (non https)
// origins. We use this service to tunnel Pokemon API responses through a
// secure origin.
var PROXY = 'https://crossorigin.me/';

// Some times we want to measure.
var startTime = performance.now();
var interpolationTime = 0;
var fetchingModelTime = 0;

// Here is the idea. This is the template for a Pokemon. It is
// in charge of parsing which Pokemon is requested from the querystring
// of the URL, fetch that pokemon and fill the template. Once the template
// has been filled, we are going to mark the document as cached and send
// to the render-store by sending the contents to the service worker.

// The cached mark is a simple `data-*` property in the document element.
var isCached = document.documentElement.dataset.cached;

if (isCached) {
  // If cached, log the times and we are done.
  logTime();
} else {
  // If not, fetch the pokemon info, fill the character sheet, log times and cache.
  var pokemonId = getPokemonId();
  getPokemon(pokemonId).then(fillCharSheet).then(logTime).then(cache);
}

// Extract the pokemon id from the querystring.
function getPokemonId() {
  return window.location.search.split('=')[1];
}

// Fetch pokemon's info as JSON.
function getPokemon(id) {
  var fetchingModelStart = performance.now();
  var url = PROXY + 'http://pokeapi.co/api/v1/pokemon/' + id + '/?_b=' + Date.now();
  return fetch(url).then(function(response) {
    fetchingModelTime = performance.now() - fetchingModelStart;
    return response.json();
  });
}

// Take the contents of the body as template and interpolate with
// the pokemon info.
function fillCharSheet(pokemon) {
  var element = document.querySelector('body');
  element.innerHTML = interpolateTemplate(element.innerHTML, pokemon);

  // Specifically for the cookbook site :(
  document.querySelector('img').onload = function() {
    if (window.parent === window) {
      return;
    }
    window.parent.document.body.dispatchEvent(new CustomEvent('iframeresize'));
  };
}

// Log times for interpolation, fetching and total loading times.
function logTime() {
  var loadingTimeLabel = document.querySelector('#loading-time-label');
  var interpolationTimeLabel =
    document.querySelector('#interpolation-time-label');
  var fetchingModelTimeLabel = document.querySelector('#fetching-time-label');
  loadingTimeLabel.textContent = (performance.now() - startTime) + ' ms';
  interpolationTimeLabel.textContent = interpolationTime + ' ms';
  fetchingModelTimeLabel.textContent = fetchingModelTime + ' ms';
}

// Mark the documents as cached, then gets all the HTML content and send to
// the service worker using a `PUT` request into `./render-store/` URL.
// You could be wondering we need to send the URL for the cached content
// but this info is implicitly added as the `referrer` property of the
// request.
function cache() {
  document.documentElement.dataset.cached = true;
  var data = document.documentElement.outerHTML;
  fetch('./render-store/', { method: 'PUT', body: data }).then(function() {
    console.log('Page cached');
  });
}

// Look for `{{key}}` fragments inside the template and replace them with
// the values of `pokemon[key]`.
function interpolateTemplate(template, pokemon) {
  var interpolationStart = performance.now();
  var result = template.replace(/{{(\w+)}}/g, function(match, field) {
    return pokemon[field];
  });
  interpolationTime = performance.now() - interpolationStart;
  return result;
}
