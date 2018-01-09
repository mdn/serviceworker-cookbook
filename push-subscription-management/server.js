// [Working example](/serviceworker-cookbook/push-subscription-management/).

// `web-push` is a library which makes sending notifications a very
// simple process.
var webPush = require('web-push');
// Global array collecting all active endpoints. In real world
// application one would use a database here.
var subscriptions = [];

// How often (in seconds) should the server send a notification to the
// user.
var pushInterval = 10;

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);

// Send notification to the push service. Remove the endpoint from the
// `subscriptions` array if the  push service responds with an error.
// Subscription has been cancelled or expired.
function sendNotification(endpoint) {
  webPush.sendNotification({
    endpoint: endpoint
  }).then(function() {
    console.log('Push Application Server - Notification sent to ' + endpoint);
  }).catch(function() {
    console.log('ERROR in sending Notification, endpoint removed ' + endpoint);
    subscriptions.splice(subscriptions.indexOf(endpoint), 1);
  });
}

// In real world application is sent only if an event occured.
// To simulate it, server is sending a notification every `pushInterval` seconds
// to each registered endpoint.
setInterval(function() {
  subscriptions.forEach(sendNotification);
}, pushInterval * 1000);

function isSubscribed(endpoint) {
  return (subscriptions.indexOf(endpoint) >= 0);
}

module.exports = function(app, route) {
  // Register a subscription by adding an endpoint to the `subscriptions`
  // array.
  app.post(route + 'register', function(req, res) {
    var endpoint = req.body.endpoint;
    if (!isSubscribed(endpoint)) {
      console.log('Subscription registered ' + endpoint);
      subscriptions.push(endpoint);
    }
    res.type('js').send('{"success":true}');
  });

  // Unregister a subscription by removing it from the `subscriptions` array
  app.post(route + 'unregister', function(req, res) {
    var endpoint = req.body.endpoint;
    if (isSubscribed(endpoint)) {
      console.log('Subscription unregistered ' + endpoint);
      subscriptions.splice(subscriptions.indexOf(endpoint), 1);
    }
    res.type('js').send('{"success":true}');
  });
};
