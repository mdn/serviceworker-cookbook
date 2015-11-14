var webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

var endpoint;
var key;

module.exports = function(app, route) {
  app.post(route + 'register', function(req) {
    endpoint = req.body.endpoint;
    key = req.body.key;
  });

  app.post(route + 'sendNotification', function(req) {
    var num = 1;

    var intervalID = setInterval(function() {
      webPush.sendNotification(endpoint, 200, key, JSON.stringify({
        visible: JSON.parse(req.query.visible),
        num: num,
      }));

      if (num++ == req.query.num) {
        clearInterval(intervalID);
      }
    }, 1000);
  });
};
