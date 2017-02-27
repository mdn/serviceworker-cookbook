// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
var webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

module.exports = function(app, route) {
  app.post(route + 'register', function(req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  app.post(route + 'sendNotification', function(req, res) {
    webPush.sendNotification({
      endpoint: req.query.endpoint,
      TTL: 200,
    })
    .catch(logError);

    setTimeout(function() {
      webPush.sendNotification({
        endpoint: req.query.endpoint,
        TTL: 200,
      })
      .then(function() {
        res.sendStatus(201);
      })
      .catch(logError);
    }, req.query.delay * 1000);

    function logError(error) {
      res.sendStatus(500);
      console.log(error);
    }
  });
};
