/* global Logger */

// <h2>SWUtil</h2>
// Service Worker helper
function SWUtil() {
}

// <h3>Are Service Workers Supported?</h3>
// Check whether service workers are supported
SWUtil.prototype.areServiceWorkersSupported = function() {
  Logger.newSection();
  Logger.log('Are Service Workers Supported?');

  Logger.debug('checking navigator.serviceWorker');

  if (navigator.serviceWorker) {
    Logger.info('Service workers supported by this browser');
    return true;
  }

  Logger.warn('No, service workers are NOT supported by this browser');
  Logger.debug(navigator.userAgent);
  return false;
};

// <h3>Are Service Workers in control?</h3>
// Check whether a service worker is controlling the application
SWUtil.prototype.isServiceWorkerControllingThisApp = function() {
  Logger.newSection();
  Logger.log('Are Service Workers in control?');

  Logger.debug('checking navigator.serviceWorker.controller');

  // Checking <code>navigator.serviceWorker.controller</code>
  if (navigator.serviceWorker.controller) {
    // A service worker controls this app
    Logger.info('A service worker controls this app');
    Logger.debug('The following service worker controls this app: ');
    Logger.debug(navigator.serviceWorker.controller.scriptURL +
                ' <= navigator.serviceWorker.controller.scriptURL');

    // Please find the <code>oninstall</code>, <code>onactivate</code>, and <code>onfetch</code> events in the [service-worker.js module](sw.html "the js module implementing a service worker").
    Logger.info('Please enable and check the browser logs for the oninstall' +
                ', onactivate, and onfetch events');

    // More on:
    // - Firefox: *about:serviceworkers*
    // - Chrome: *chrome://serviceworker-internals/*
    // - [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#Browser_compatibility)
    Logger.debug('More on about:serviceworkers (Firefox) ' +
                 'or chrome://serviceworker-internals/');

    return true;
  }

  Logger.warn('No, there is no service worker controlling this app');
  return false;
};

// <h3>Register a Service Worker</h3>
// Register a service worker
SWUtil.prototype.registerServiceWorker = function(scriptURL, scope) {
  var swRegisterSecondParam = {};

  Logger.newSection();
  Logger.log('Registering service worker...');
  Logger.info('Registering service worker with serviceWorker.register()');

  Logger.debug('navigator.serviceWorker.register(scriptURL, scope)');
  Logger.debug('scriptURL: ' + scriptURL);

  // add optional parameter 'scope' if specified
  if (scope) {
    swRegisterSecondParam.scope = scope;
    Logger.debug('options.scope: ' + swRegisterSecondParam.scope);
  }

  return new Promise(
    function then(resolve, reject) {
      // Calling <code>navigator.serviceWorker.register()</code>
      navigator.serviceWorker.register(
        scriptURL,
        swRegisterSecondParam
      ).then(
        // <h4>registration Success</h4>
        function registrationSuccess(swRegistration) {
          Logger.debug('registrationSuccess(swRegistration)');
          Logger.debug(swRegistration);

          // Checking the <code>active</code> attribute on a <code>ServiceWorkerRegistration</code> object
          if (swRegistration.active) {
            // Registering the active service worker again
            Logger.debug('Registering the active service worker again: ');
            Logger.debug(swRegistration.active.scriptURL +
                         ' <= swRegistration.active.scriptURL');
          }

          // Checking the <code>installing</code> attribute on a <code>ServiceWorkerRegistration</code> object
          if (swRegistration.installing) {
            // Registering the following service worker for the first time
            Logger.debug('Registering the following service worker for ' +
                         'the first time: ');
            Logger.debug(swRegistration.installing.scriptURL +
                         ' <= swRegistration.installing.scriptURL');
          }

          if (swRegistration.scope) {
            Logger.debug('with scope: ' + swRegistration.scope +
                         ' <= swRegistration.scope');
          }

          // Service worker registered
          Logger.info('Service worker successfully registered');
          // Please find the <code>oninstall</code>, <code>onactivate</code>, and <code>onfetch</code> events in the [service-worker.js module](sw.html "the js module implementing a service worker").
          Logger.info('Please enable and check the browser logs for' +
                      ' the oninstall, onactivate, and onfetch events');
          // SW is in control, once document is reloaded
          Logger.info('SW is in control, once document is reloaded');

          // More on:
          // - Firefox: *about:serviceworkers*
          // - Chrome: *chrome://serviceworker-internals/*
          // - [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#Browser_compatibility)
          Logger.debug('More on about:serviceworkers (Firefox) ' +
                       'or chrome://serviceworker-internals/');

          resolve();
        },
        // <h4>registration Error</h4>
        function registrationError(why) {
          Logger.debug('registrationError(why)');
          // Service worker NOT registered
          Logger.info('Service worker NOT registered');
          Logger.error(why);

          reject();
        }
      );
    }
  );
};

// <h3>Unregister a Service Worker</h3>
// Unregister the active service worker
SWUtil.prototype.unregisterServiceWorker = function() {
  Logger.newSection();

  Logger.log('Unregistering the active service worker...');
  Logger.debug('if something goes wrong, please unregister ' +
               'the service worker ');
  Logger.debug('about:serviceworkers (Firefox) ' +
               'or chrome://serviceworker-internals/');

  return new Promise(
    function then(resolve, reject) {
      Logger.debug('navigator.serviceWorker.getRegistration()' +
                   '.then(success, error)');
      // Calling <code>navigator.serviceWorker.getRegistration()</code>
      navigator.serviceWorker.getRegistration()
      .then(function getRegistrationSuccess(swRegistration) {
        Logger.debug('getRegistrationSuccess(swRegistration)');
        Logger.debug(swRegistration);
        Logger.debug('Unregistering the following service worker: ' +
          swRegistration.active.scriptURL +
          ' <= swRegistration.active.scriptURL');
        Logger.debug('with scope ' + swRegistration.scope +
                     ' <= swRegistration.scope');

        // Calling <code>unregister()</code> on a <code>ServiceWorkerRegistration</code> object
        Logger.debug('swRegistration.unregister().then()');
        swRegistration.unregister()
          .then(
            // <h4>unregister Success</h4>
            function unregisterSuccess() {
              Logger.debug('unregisterSuccess()');
              // The service worker has been successfully unregistered
              Logger.info('The service worker has been ' +
                          'successfully unregistered');

              // More on:
              // - Firefox: *about:serviceworkers*
              // - Chrome: *chrome://serviceworker-internals/*
              // - [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#Browser_compatibility)
              Logger.debug('More on about:serviceworkers (Firefox) ' +
                           'or chrome://serviceworker-internals/');

              resolve();
            },
            // <h4>unregister Error</h4>
            function unregisterError(why) {
              Logger.debug('unregisterError(why)');
              // The service worker has NOT been unregistered
              Logger.error('The service worker has NOT been unregistered');
              Logger.error(why);

              reject();
            }
          );
      },
      // <h4>Error getting a Service Worker Registration</h4>
      function getRegistrationError(why) {
        Logger.debug('getRegistrationError(why)');
        Logger.error(why);
        // It has been not possibile to unregister the service worker
        Logger.warn('It has been not possibile to unregister' +
                    ' the service worker');
      }
    );
    }
  );
};
