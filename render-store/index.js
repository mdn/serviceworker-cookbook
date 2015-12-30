// Modern browsers prevent mixed content. I.e., if the page is served from
// a safe (https) origin, they will block the content from other (non https)
// origins. We use this service to tunnel Pokemon API responses through a
// secure origin.
var PROXY = 'https://crossorigin.me/';

// We need the pokedex entry point to retrieve the complete list
// of Pokemon.
var POKEDEX = PROXY + 'http://pokeapi.co/api/v1/pokedex/1/';

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

      // Specifically for the cookbook site :(
      if (window.parent !== window) {
        window.parent.document.body
          .dispatchEvent(new CustomEvent('iframeresize'));
      }
    });
}

// Creates the links for the pokemon list. These links will be intercepted
// by the service worker.
function fillPokemonList(pokemonList) {
  var listElement = document.getElementById('pokemon-list');
  var buffer = pokemonList.map(function(pokemon) {
    var uriTokens = pokemon.resource_uri.split('/');
    var id = uriTokens[uriTokens.length - 2];
    return '<li><a href="pokemon.html?id=' + id + '">' + pokemon.name +
           '</a></li>';
  });
  listElement.innerHTML = buffer.join('\n');
}
