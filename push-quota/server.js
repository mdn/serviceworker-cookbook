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

module.exports = function(app, route) {
  app.get(route + 'vapidPublicKey', function(req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  app.post(route + 'register', function(req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  // Send N notifications, specifying whether the service worker will need to show
  // a visible notification or not using the push payload:
  // - 'true': show a notification;
  // - 'false': don't show a notification.
  app.post(route + 'sendNotification', function(req, res) {
    const subscription = req.body.subscription;
    const payload = JSON.stringify(req.body.visible);
    const options = {
      TTL: 200
    };

    let num = 1;

    let promises = [];

    let intervalID = setInterval(function() {
      promises.push(webPush.sendNotification(subscription, payload, options));

      if (num++ === Number(req.body.num)) {
        clearInterval(intervalID);

        Promise.all(promises)
        .then(function() {
          res.sendStatus(201);
        })
        .catch(function(error) {
          res.sendStatus(500);
          console.log(error);
        })
      }
    }, 1000);
  });
};
