// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol-01 and
// https://tools.ietf.org/html/draft-thomson-webpush-encryption-01.
var webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

var endpoint;
var key;

module.exports = function(app, route) {
  app.post(route + 'register', function(req) {
    endpoint = req.body.endpoint;
    key = req.body.key;
  });

  // Send N notifications, specifying whether the service worker will need to show
  // a visible notification or not using the push payload:
  // - 'true': show a notification;
  // - 'false': don't show a notification.
  app.post(route + 'sendNotification', function(req) {
    var num = 1;

    var intervalID = setInterval(function() {
      webPush.sendNotification(endpoint, 200, key, req.query.visible);

      if (num++ === Number(req.query.num)) {
        clearInterval(intervalID);
      }
    }, 1000);
  });
};
