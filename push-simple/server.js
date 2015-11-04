var webPush = require('web-push');

var endpoint;

module.exports = function(app, route) {
  app.post(route + 'register', function(req) {
    endpoint = req.body.endpoint;
  });

  app.post(route + 'sendNotification', function() {
    webPush.sendNotification(endpoint);
  });
};
