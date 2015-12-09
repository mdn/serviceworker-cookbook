// Our textarea
var textarea = document.querySelector('textarea');

// Register the ServiceWorker
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('service-worker.js', {
    scope: '.'
  })
  .then(function(registration) {
    console.log('The service worker has been registered ', registration);

    if (navigator.serviceWorker.controller && 
        navigator.serviceWorker.controller.state === 'activated') {
      init();
    } else {
      // Listen for claiming of our ServiceWorker
      navigator.serviceWorker.addEventListener('controllerchange', function(event) {
        console.log('[controllerchange] A "controllerchange" event has happened within navigator.serviceWorker: ', event);

        // Listen for changes in the state of our ServiceWorker
        navigator.serviceWorker.controller.addEventListener('statechange', function() {
          console.log('[controllerchange][statechange] A "statechange" has occured: ', this.state);

          // If the ServiceWorker becomes "activated", let the user know they can go offline!
          if (this.state === 'activated') {
            init();
          }
        });
      });
    }
  })
  .catch(function() {
    console.error('The service worker could not be registered');
    init();
  });
} else {
  init();
}

// Function to get content for page
function init() {
  return fetch('?get')
    .then(function(response) {
      return response.json();
    })
    .then(function(obj) {
      textarea.value = obj.content;

      // Now that the content is populated and we know the "setup" is good,
      // we can set off autosaving every 5 seconds
      //setInterval(function() {
      setTimeout(function() {
        // Thanks to our service worker, "saving" will be as simple fetch!
        var request = {
          method: 'POST',
          body: JSON.stringify({
            'content': textarea.value,
            'id': 1
          }),
          headers: { 'content-type': 'application/json' }
        };

        // Disable the save button, notify that a save is in progress
        var saveButton = document.querySelector('#post-save');
        saveButton.value = 'Saving....';
        saveButton.disabled = true;

        fetch('?save', request)
          .then(enableButton)
          .catch(enableButton);

        function enableButton() {
          saveButton.value = 'Save';
          saveButton.disabled = false;
        }

      }, 5000);
    });
}
