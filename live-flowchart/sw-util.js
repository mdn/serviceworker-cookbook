/* global Logger, SWUtil */

function SWUtil() {
  Logger.log('\nSWUtil()');
}

SWUtil.prototype = {

  areServiceWorkersSupported: function areServiceWorkersSupported() {
    Logger.log('\nSWUtil.areServiceWorkersSupported()');

    Logger.debug('checking navigator.serviceWorker');

    if (navigator.serviceWorker) {
      Logger.info('Service workers supported by this browser');
      return true;
    }

    Logger.warn('No, service workers are NOT supported by this browser');
    Logger.debug(navigator.userAgent);
    return false;
  },

  isServiceWorkerControllingThisApp: function isServiceWorkerControllingThisApp() {
    Logger.log('\nSWUtil.isServiceWorkerControllingThisApp()');

    Logger.debug('checking navigator.serviceWorker.controller');

    if (navigator.serviceWorker.controller) {
      Logger.info('A service worker controls this app');
      Logger.debug('The following service worker controls this app: ');
      Logger.debug(navigator.serviceWorker.controller.scriptURL + ' <= navigator.serviceWorker.controller.scriptURL');
      Logger.info('Please enable and check the browser logs for the oninstall, onactivate, and onfetch events');
      Logger.debug('More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/');

      return true;
    }

    Logger.warn('No, there is no service worker controlling this app');
    return false;
  },

  registerServiceWorker: function registerServiceWorker() {
    Logger.log('\nSWUtil.registerServiceWorker()');

    Logger.info('Register service worker with serviceWorker.register()');

    return new Promise(
      function then(resolve, reject) {
        Logger.debug('navigator.serviceWorker.register(\'./sw.js\', { scope: \'./\' }).then(success, error)');
        navigator.serviceWorker.register(
          './sw.js',
          { scope: './' }
        ).then(
          function registerSuccess(swRegistration) {
            Logger.debug('success(swRegistration)');
            Logger.debug(swRegistration);

            Logger.debug('checking navigator.serviceWorker.controller');
            if (navigator.serviceWorker.controller) {
              Logger.debug('Registering the active service worker again: ');
              Logger.debug(swRegistration.active.scriptURL + ' <= swRegistration.active.scriptURL');
            } else {
              Logger.debug('Registering the following service worker for the first time: ');
              Logger.debug(swRegistration.installing.scriptURL + ' <= swRegistration.installing.scriptURL');
            }
            Logger.debug('with scope: ' + swRegistration.scope + ' <= swRegistration.scope');

            Logger.info('Service worker registered');
            Logger.info('Please enable and check the browser logs for the oninstall, onactivate, and onfetch events');
            Logger.info('SW is in control, once document is reloaded');
            Logger.debug('More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/');

            resolve();
          },
          function registerError(why) {
            Logger.debug('error(why)');
            Logger.log(why);

            reject();
          }
        );
      }
    );
  },

  unregisterServiceWorker: function unregisterServiceWorker() {
    Logger.log('\nSWUtil.unregisterServiceWorker()');

    return new Promise(
      function then(resolve, reject) {
        Logger.debug('navigator.serviceWorker.getRegistration().then(success, error)');
        navigator.serviceWorker.getRegistration().then(
          function getRegistrationSuccess(swRegistration) {
            Logger.debug('success(swRegistration)');
            Logger.debug(swRegistration);
            Logger.debug('Unregistering the following service worker: ' + swRegistration.active.scriptURL + ' <= swRegistration.active.scriptURL');
            Logger.debug('with scope ' + swRegistration.scope + ' <= swRegistration.scope');

            Logger.debug('swRegistration.unregister().then()');
            swRegistration.unregister()
              .then(
                function unregisterSuccess() {
                  Logger.debug('success()');
                  Logger.info('The service worker has been successfully unregistered');
                  Logger.debug('More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/');

                  resolve();
                },
                function unregisterError(why) {
                  Logger.debug('error(why)');
                  Logger.error(why);

                  reject();
                }
              );
          },
          function getRegistrationError(why) {
            Logger.debug('error(why)');
            Logger.debug(why);
            Logger.warn('It has been not possibile to unregister the service worker');
            Logger.debug('Please unregister the service worker using about:serviceworkers (Firefox) or chrome://serviceworker-internals/');
          }
        );
      }
    );
  },

};
