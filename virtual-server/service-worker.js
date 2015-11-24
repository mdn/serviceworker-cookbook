/* eslint no-unused-vars: 0 */
/* global importScripts, ServiceWorkerWare */
importScripts('./lib/ServiceWorkerWare.js');

// These are the default quotations. `makeDefaults()` simply add the id and the
// sticky flag to make them non removables.
var quotations = makeDefaults([
  {
    text: 'Humanity is smart. Sometime in the technology world we think we are smarter, ' +
      'but we are not smarter than you.',
    author: 'Mitchell Baker'
  },
  {
    text: 'A computer would deserve to be called intelligent if it could deceive a human ' +
      'into believing that it was human.',
    author: 'Alan Turing'
  },
  {
    text: 'If you optimize everything, you will always be unhappy.',
    author: 'Donald Knuth'
  },
  {
    text: 'If you don\'t fail at least 90 percent of the time, you\'re not aiming high enough',
    author: 'Alan Kay'
  },
  {
    text: 'Colorless green ideas sleep furiously.',
    author: 'Noam Chomsky'
  }
]);

// Adds id and the sticky flag to a list of quotes.
function makeDefaults(quotationList) {
  for (var index = 0, max = quotationList.length, quote; index < max; index++) {
    quote = quotationList[index];
    quote.id = index + 1;
    quote.isSticky = true;
  }
  return quotationList;
}

// Determine the root for the routes. This convert something like
// `http://example.com/path/to/sw.js` to
// `http://example.com/path/to/`
var root = (function() {
  var tokens = (self.location + '').split('/');
  tokens[tokens.length - 1] = '';
  return tokens.join('/');
}());

// By using Mozillas' ServiceWorkerWare we can quickly setup this _client server_.
// Compare this code with the one from the [server side in
// API analytics recipe](/api-analytics_server_doc.html).
var worker = new ServiceWorkerWare();

// Returns an array with all quotations.
worker.get(root + 'api/quotations', function(req, res) {
  return new Response(JSON.stringify(quotations.filter(function(item) {
    return item !== null;
  })));
});

// Delete a quote specified by id. The id is the position in the collection
// of quotations (the position is 1 based instead of 0).
worker.delete(root + 'api/quotations/:id', function(req, res) {
  var id = parseInt(req.parameters.id, 10) - 1;
  if (!quotations[id].isSticky) {
    quotations[id] = null;
  }
  return new Response({ status: 204 });
});

// Add a new quote to the collection.
worker.post(root + 'api/quotations', function(req, res) {
  return req.json().then(function(quote) {
    quote.id = quotations.length + 1;
    quotations.push(quote);
    return new Response(JSON.stringify(quote), { status: 201 });
  });
});

// Start the service worker
worker.init();
