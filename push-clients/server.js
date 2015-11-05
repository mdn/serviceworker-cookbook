var webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

var endpoint;

module.exports = function(app, route) {
  app.post(route + 'register', function(req) {
    endpoint = req.body.endpoint;
  });

  app.post(route + 'sendNotification', function(req) {
    setTimeout(function() {
      webPush.sendNotification(endpoint, 200);
    }, 10000);
  });
};
