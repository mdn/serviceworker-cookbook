var path = require('path');
var request = require('request');
var webPush = require('web-push');

var endpoint;

module.exports = function(app, route) {
  app.post(route + 'register', function(req, res) {
    endpoint = req.body.endpoint;
  });

  app.post(route + 'sendNotification', function() {
    webPush.sendNotification(endpoint);
  });
};
