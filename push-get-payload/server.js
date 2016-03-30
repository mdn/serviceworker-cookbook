// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
var webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

var payloads = {};

module.exports = function(app, route) {
  app.post(route + 'register', function(req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  app.post(route + 'sendNotification', function(req, res) {
    setTimeout(function() {
      payloads[req.body.endpoint] = req.body.payload;
      webPush.sendNotification(req.body.endpoint, {
        TTL: req.body.ttl,
      })
      .then(function() {
        res.sendStatus(201);
      });
    }, req.body.delay * 1000);
  });

  app.get(route + 'getPayload', function(req, res) {
    res.send(payloads[req.query.endpoint]);
  });
};
