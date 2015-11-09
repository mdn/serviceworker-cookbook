var webPush = require('web-push');
// collection of endpoints stored in memory (in production it should be
// a database)
var subscriptions = [];

var TTL = 200;
// how often should the server send the notification
var pushInterval = 10;

// setting the Google Cloud Messaging API Key
if (!process.env.GCM_API_KEY) {
  console.error('If you want Chrome to work, you need to set the GCM_API_KEY environment variable to your GCM API key.');
} else {
  webPush.setGCMAPIKey(process.env.GCM_API_KEY);
}

function sendNotification(endpoint) {
  webPush.sendNotification(endpoint, TTL).then(function() {
    console.log('Push Application Server - Notification sent to ' + endpoint);
  }).catch(function() {
    // there has been an error - it is possible the subscription has
    // been cancelled or expired - remove the endpoint
    console.log('ERROR in sending Notification, endpoint removed ' + endpoint);
    subscriptions.splice(subscriptions.indexOf(endpoint), 1);
  });
}

// To simulate a real life notification server we're sending
// a notification every [pushInterval] seconds to each endpoints
setInterval(function() {
  subscriptions.forEach(sendNotification);
}, pushInterval * 1000);

function isSubscribed(endpoint) {
  return (subscriptions.indexOf(endpoint) >= 0);
}

module.exports = function(app, route) {
  // register subscription
  app.post(route + 'register', function(req, res) {
    // get an endpoint from POST request's body
    var endpoint = req.body.endpoint;
    if (!isSubscribed(endpoint)) {
      console.log('Subscription registered ' + endpoint);
      subscriptions.push(endpoint);
    }
    res.type('js').send('{"success":true}');
  });

  // unregister subscription
  app.post(route + 'unregister', function(req, res) {
    // get an endpoint from POST request's body
    var endpoint = req.body.endpoint;
    if (isSubscribed(endpoint)) {
      // remove from subscriptions list
      console.log('Subscription unregistered ' + endpoint);
      subscriptions.splice(subscriptions.indexOf(endpoint), 1);
    }
    res.type('js').send('{"success":true}');
  });
};
