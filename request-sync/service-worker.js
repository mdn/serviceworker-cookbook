/* eslint no-unused-vars: 0 */
/* global importScripts, ServiceWorkerWare */
importScripts('./lib/ServiceWorkerWare.js');

// Determine the root for the routes. This convert something like
// `http://example.com/path/to/sw.js` to
// `http://example.com/path/to/`
var root = (function() {
  var tokens = (self.location + '').split('/');
  tokens[tokens.length - 1] = '';
  return tokens.join('/');
}());

// // By using Mozillas' ServiceWorkerWare we can quickly setup this
// // _client server_.
var worker = new ServiceWorkerWare();

// // Returns an array with all quotations.
// worker.get(root + 'api/quotations', function(req, res) {
//   return new Response(JSON.stringify(quotations.filter(function(item) {
//     return item !== null;
//   })));
// });

// // Delete a quote specified by id. The id is the position in the collection
// // of quotations (the position is 1 based instead of 0).
// worker.delete(root + 'api/quotations/:id', function(req, res) {
//   var id = parseInt(req.parameters.id, 10) - 1;
//   if (!quotations[id].isSticky) {
//     quotations[id] = null;
//   }
//   return new Response({ status: 204 });
// });

// // Add a new quote to the collection.
// worker.post(root + 'api/quotations', function(req, res) {
//   return req.json().then(function(quote) {
//     quote.id = quotations.length + 1;
//     quotations.push(quote);
//     return new Response(JSON.stringify(quote), { status: 201 });
//   });
// });

// Start the service worker
worker.init();
