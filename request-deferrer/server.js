
var bodyParser = require('body-parser');

// A simple server to expose a quotation API, sessions are stored in the local storage
// of the client.

// Simple session handling with a hash of sessions.
var sessions = {};

// The default quotations. `makeDefaults()` simply add the id and the
// sticky flag to make them non removables.
var defaultQuotations = makeDefaults([
  {
    text: 'Humanity is smart. Sometime in the technology world we think we ' +
    'are smarter, but we are not smarter than you.',
    author: 'Mitchell Baker'
  },
  {
    text: 'A computer would deserve to be called intelligent if it could ' +
    'deceive a human into believing that it was human.',
    author: 'Alan Turing'
  },
  {
    text: 'If you optimize everything, you will always be unhappy.',
    author: 'Donald Knuth'
  },
  {
    text: 'If you don\'t fail at least 90 percent of the time, you\'re not ' +
    'aiming high enough',
    author: 'Alan Kay'
  },
  {
    text: 'Colorless green ideas sleep furiously.',
    author: 'Noam Chomsky'
  }
]);

// REST APIs for quoation and log managements. The service worker approach allow
// us to log each request without touching the API implementation.
module.exports = function(app, route) {
  // Allow express to parse the body of the requests.
  app.use(bodyParser.json());

  // Returns an array with all quotations.
  app.get(route + 'api/quotations', function(req, res) {
    var quotations = getQuotationsForSession(req.query.session);
    res.json(quotations.filter(function(item) {
      return item !== null;
    }));
  });

  // Delete a quote specified by id. The id is the position in the collection
  // of quotations (the position is 1 based instead of 0).
  app.delete(route + 'api/quotations/:id', function(req, res) {
    var quotations = getQuotationsForSession(req.query.session);
    var id = parseInt(req.params.id, 10) - 1;
    if (!quotations[id].isSticky) {
      quotations[id] = null;
    }
    res.sendStatus(204);
  });

  // Add a new quote to the collection.
  app.post(route + 'api/quotations', function(req, res) {
    var quotations = getQuotationsForSession(req.query.session);
    var quote = req.body;
    quote.id = quotations.length + 1;
    quotations.push(quote);
    res.status(201).json(quote);
  });
};

// Adds id and the sticky flag to a list of quotes.
function makeDefaults(quotationList) {
  for (var index = 0, max = quotationList.length, quote; index < max; index++) {
    quote = quotationList[index];
    quote.id = index + 1;
    quote.isSticky = true;
  }
  return quotationList;
}

// Get the quotation collection for a session
function getQuotationsForSession(session) {
  if (!(session in sessions)) {
    sessions[session] = JSON.parse(JSON.stringify(defaultQuotations));
  }
  return sessions[session];
}
