// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol-01 and
// https://tools.ietf.org/html/draft-thomson-webpush-encryption-01.
var webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

module.exports = function(app, route) {
  app.post(route + 'register', function(req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  app.post(route + 'sendNotification', function(req, res) {
    setTimeout(function() {
      webPush.sendNotification(req.body.endpoint, req.body.ttl, req.body.key,
                               req.body.payload)
      .then(function() {
        res.sendStatus(201);
      });
    }, req.body.delay * 1000);
  });
};
