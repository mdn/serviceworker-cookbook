var startTime = Date.now();
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
  var url = 'http://pokeapi.co/api/v1/pokemon/' + id + '/?_b=' + Date.now();
  return fetch(url).then(function (response) {
    return response.json();
  });
}

function fillCharSheet(pokemon) {
  var element = document.querySelector('body');
  element.innerHTML = interpolateTemplate(element.innerHTML, pokemon);
};

function logTime() {
  var loadingTime = document.querySelector('#loading-time');
  var label = loadingTime.parentNode;
  loadingTime.textContent = (Date.now() - startTime) + ' ms';
  label.hidden = false;
}

function cache() {
  document.documentElement.dataset.cached = true;
  var url = window.location;
  var data = document.documentElement.outerHTML;
  var headers = { 'x-url': window.location };
  fetch('/render-store/', { method: 'PUT', body: data, headers: headers }).then(function () {
    console.log('Page cached');
  });
}

function interpolateTemplate(template, pokemon) {
  return template.replace(/{{(\w+)}}/g, function (match, field) {
    return pokemon[field];
  });
}
