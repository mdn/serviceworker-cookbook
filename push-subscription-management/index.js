// [Working example](/serviceworker-cookbook/push-subscription-management/).

var subscriptionButton = document.getElementById('subscriptionButton');

// Provide a Promise with subscription to not repeat too often
function getSubscription() {
  return navigator.serviceWorker.ready
    .then(function(registration) {
      return registration.pushManager.getSubscription();
    });
}

// Register service worker and check the initial subscription state.
// Set the UI (button) according to the status.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function() {
      console.log('service worker registered');
      subscriptionButton.removeAttribute('disabled');
    });
  getSubscription()
    .then(function(subscription) {
      if (subscription) {
        console.log('Already subscribed', subscription.endpoint);
        setUnsubscribeButton();
      } else {
        setSubscribeButton();
      }
    });
}

// Get the `registration` from service worker and create a new
// subscription using `registration.pushManager.subscribe`. Then
// register received new subscription by sending a POST request with its
// endpoint to the server.
function subscribe() {
  navigator.serviceWorker.ready.then(function(registration) {
    return registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(newSubscription) {
        return newSubscription;
      });
  }).then(function(subscription) {
    console.log('Subscribed', subscription.endpoint);
    return fetch('register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });
  }).then(setUnsubscribeButton);
}

// Get existing subscription from service worker, unsubscribe
// (`subscription.unsubscribe()`) and unregister it in the server with
// a POST request to stop sending push messages to
// unexisting endpoint.
function unsubscribe() {
  getSubscription().then(function(subscription) {
    return subscription.unsubscribe()
      .then(function() {
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
  }).then(setSubscribeButton);
}

// Change the subscription button's text and action.
function setSubscribeButton() {
  subscriptionButton.onclick = subscribe;
  subscriptionButton.textContent = 'Subscribe!';
}

function setUnsubscribeButton() {
  subscriptionButton.onclick = unsubscribe;
  subscriptionButton.textContent = 'Unsubscribe!';
}
