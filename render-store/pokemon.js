var startTime = performance.now();
var interpolationTime = 0;
var fetchingModelTime = 0;
var isCached = document.documentElement.dataset.cached;

if (isCached) {
  logTime();
} else {
  var pokemonId = getPokemonId();
  getPokemon(pokemonId).then(fillCharSheet).then(logTime).then(cache);
}

function getPokemonId() {
  return window.location.search.split('=')[1];
}

function getPokemon(id) {
  var fetchingModelStart = performance.now();
  var url = 'http://pokeapi.co/api/v1/pokemon/' + id + '/?_b=' + Date.now();
  return fetch(url).then(function (response) {
    fetchingModelTime = performance.now() - fetchingModelStart;
    return response.json();
  });
}

function fillCharSheet(pokemon) {
  var element = document.querySelector('body');
  element.innerHTML = interpolateTemplate(element.innerHTML, pokemon);
}

function logTime() {
  var loadingTimeLabel = document.querySelector('#loading-time-label');
  var interpolationTimeLabel = document.querySelector('#interpolation-time-label');
  var fetchingModelTimeLabel = document.querySelector('#fetching-time-label');
  loadingTimeLabel.textContent = (performance.now() - startTime) + ' ms';
  interpolationTimeLabel.textContent = interpolationTime + ' ms';
  fetchingModelTimeLabel.textContent = fetchingModelTime + ' ms';
}

function cache() {
  document.documentElement.dataset.cached = true;
  var url = window.location;
  var data = document.documentElement.outerHTML;
  fetch('/render-store/', { method: 'PUT', body: data }).then(function () {
    console.log('Page cached');
  });
}

function interpolateTemplate(template, pokemon) {
  var interpolationStart = performance.now();
  var result = template.replace(/{{(\w+)}}/g, function (match, field) {
    return pokemon[field];
  });
  interpolationTime = performance.now() - interpolationStart;
  return result;
}
