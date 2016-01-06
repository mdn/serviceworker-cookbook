
var path = require('path');
var bodyParser = require('body-parser');
var swig = require('swig');

// A simple server to expose **two APIs**, one for quoation management
// and another for getting logs.

// This is the collection of logs.
var requestsLog = [];

// List of the default quotations.
var quotations = [
  {
    text: 'Humanity is smart. Sometime in the technology world we think' +
    'we are smarter, but we are not smarter than you.',
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
    text: 'If you don\'t fail at least 90 percent of the time' +
    'you\'re not aiming high enough',
    author: 'Alan Kay'
  },
  {
    text: 'Colorless green ideas sleep furiously.',
    author: 'Noam Chomsky'
  }
].map(function(quotation, index) {
  // Add the id and the sticky flag to make the default quotations non removable.
  quotation.id = index + 1;
  quotation.isSticky = true;

  return quotation;
});

// REST APIs for quoation and log managements. The service worker approach allow
// us to log each request without touching the API implementation.
module.exports = function(app, route) {
  var report = swig.compileFile(path.join(__dirname, './report.html'));

  // Allow express to parse the body of the requests.
  app.use(bodyParser.json());

  // Shows the report.
  app.get(route + 'report', function(req, res) {
    var statistics = summarizeLogs();
    var buffer = report({ statistics: statistics });
    res.send(buffer);
  });

  // Adds a new log with url and operation.
  app.post(route + 'report/logs', function(req, res) {
    var logEntry = logRequest(req.body);
    res.status(201).json(logEntry);
  });

  // Returns an array with all quotations.
  app.get(route + 'api/quotations', function(req, res) {
    res.json(quotations.filter(function(item) {
      return item !== null;
    }));
  });

  // Delete a quote specified by id. The id is the position in the collection
  // of quotations (the position is 1 based instead of 0).
  app.delete(route + 'api/quotations/:id', function(req, res) {
    var id = parseInt(req.params.id, 10) - 1;
    if (!quotations[id].isSticky) {
      quotations[id] = null;
    }
    res.sendStatus(204);
  });

  // Add a new quote to the collection.
  app.post(route + 'api/quotations', function(req, res) {
    var quote = req.body;
    quote.id = quotations.length + 1;
    quotations.push(quote);
    res.status(201).json(quote);
  });
};

// Log a request.
function logRequest(request) {
  request.id = requestsLog.length + 1;
  requestsLog.push(request);
  return request;
}

// Aggregate logs by url, counting GET, DELETE and POST operations.
function summarizeLogs() {
  // Here we perform the aggregations.
  var aggregations = requestsLog.reduce(function(partialSummary, entry) {
    if (!(entry.url in partialSummary)) {
      partialSummary[entry.url] = {
        url: entry.url,
        GET: 0,
        POST: 0,
        DELETE: 0,
      };
    }
    partialSummary[entry.url][entry.method]++;
    return partialSummary;
  }, {});

  // But we return an array instead of an object.
  return Object.keys(aggregations).map(function(url) {
    return aggregations[url];
  });
}
