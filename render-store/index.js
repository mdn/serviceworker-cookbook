
// We need the pokedex entry point to retrieve the complete list
// of Pokemon.
var POKEDEX = 'http://pokeapi.co/api/v1/pokedex/1/';

// Once the Service Worker is activated, load the Pokemon list.
if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker.controller) {
    loadPokemonList();
  } else {
    navigator.serviceWorker.register('service-worker.js');
    navigator.serviceWorker.ready.then(function() {
      loadPokemonList();
    });
  }
}

// Fetch the Pokemon list from pokedex and create the list
// of links.
function loadPokemonList() {
  fetch(POKEDEX)
    .then(function(response) {
      return response.json();
    })
    .then(function(info) {
      fillPokemonList(info.pokemon);
    });
}

// Creates the links for the pokemon list. These links will be intercepted
// by the service worker.
function fillPokemonList(pokemonList) {
  var listElement = document.getElementById('pokemon-list');
  var total = pokemonList.length;
  var buffer = [];
  for (var index = 0; index < total; index++) {
    var pokemon = pokemonList[index];
    var uriTokens = pokemon.resource_uri.split('/');
    var id = uriTokens[uriTokens.length - 2];
    buffer.push('<li><a href="pokemon.html?id=' + id + '">' + pokemon.name + '</a></li>');
  }
  listElement.innerHTML = buffer.join('\n');
}
