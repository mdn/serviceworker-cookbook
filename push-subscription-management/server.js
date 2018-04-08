// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
const webPush = require('web-push');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
    "environment variables. You can use the following ones:");
  console.log(webPush.generateVAPIDKeys());
  return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'https://serviceworke.rs/',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Global array collecting all active endpoints. In real world
// application one would use a database here.
const subscriptions = {};

// How often (in seconds) should the server send a notification to the
// user.
const pushInterval = 10;

// Send notification to the push service. Remove the subscription from the
// `subscriptions` array if the  push service responds with an error.
// Subscription has been cancelled or expired.
function sendNotification(subscription) {
  webPush.sendNotification(subscription)
  .then(function() {
    console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
  }).catch(function() {
    console.log('ERROR in sending Notification, endpoint removed ' + subscription.endpoint);
    delete subscriptions[subscription.endpoint];
  });
}

// In real world application is sent only if an event occured.
// To simulate it, server is sending a notification every `pushInterval` seconds
// to each registered endpoint.
setInterval(function() {
  Object.values(subscriptions).forEach(sendNotification);
}, pushInterval * 1000);

module.exports = function(app, route) {
  app.get(route + 'vapidPublicKey', function(req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  // Register a subscription by adding it to the `subscriptions` array.
  app.post(route + 'register', function(req, res) {
    var subscription = req.body.subscription;
    if (!subscriptions[subscription.endpoint]) {
      console.log('Subscription registered ' + subscription.endpoint);
      subscriptions[subscription.endpoint] = subscription;
    }
    res.sendStatus(201);
  });

  // Unregister a subscription by removing it from the `subscriptions` array
  app.post(route + 'unregister', function(req, res) {
    var subscription = req.body.subscription;
    if (subscriptions[subscription.endpoint]) {
      console.log('Subscription unregistered ' + subscription.endpoint);
      delete subscriptions[subscription.endpoint];
    }
    res.sendStatus(201);
  });
};
