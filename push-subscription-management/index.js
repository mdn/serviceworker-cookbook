var subscriptionButton = document.getElementById('subscriptionButton');

function getSubscription() {
  return navigator.serviceWorker.ready
    .then(function(registration) {
      return registration.pushManager.getSubscription();
    });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function() {
      console.log('service worker registered');
      subscriptionButton.removeAttribute('disabled');
    });
  getSubscription()
    .then(function(subscription) {
      // check if already subscribed
      // get push manager subscription
      if (subscription) {
        // already subscribed
        console.log('Already subscribed', subscription.endpoint);
        setUnsubscribeButton();
      } else {
        // user needs to subscribe
        setSubscribeButton();
      }
    });
}

function subscribe() {
  navigator.serviceWorker.ready.then(function(registration) {
    // subscribe to push service
    return registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(newSubscription) {
        return newSubscription;
      });
  }).then(function(subscription) {
    console.log('Subscribed', subscription.endpoint);
    // register subscription in the application server
    return fetch('register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });
  // set the button to be an unsubscribe button
  }).then(setUnsubscribeButton);
}

function unsubscribe() {
  getSubscription().then(function(subscription) {
    return subscription.unsubscribe()
      .then(function() {
        // unregister subscription in the application server
        // otherwise server will try to continue sending the push messages
        console.log('Unsubscribed', subscription.endpoint);
        return fetch('unregister', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      });
  // set the button to be a subscribe button
  }).then(setSubscribeButton);
}

function setSubscribeButton() {
  subscriptionButton.onclick = subscribe;
  subscriptionButton.textContent = 'Subscribe!';
}

function setUnsubscribeButton() {
  subscriptionButton.onclick = unsubscribe;
  subscriptionButton.textContent = 'Unsubscribe!';
}
