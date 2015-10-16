/* global Logger */

/*
 * @class SWUtil
 * Service Worker helper
 */
function SWUtil() {
  this.constructor();
}

/*
 * @constructs
 */
SWUtil.prototype.constructor = function constructor() {
  Logger.log('new SWUtil()');
};

/*
 * @method areServiceWorkersSupported
 * Check whether service workers are supported
 * @returns {Boolean}
 */
SWUtil.prototype.areServiceWorkersSupported = function areServiceWorkersSupported() {
  Logger.newSection();
  Logger.log('SWUtil.areServiceWorkersSupported()');

  Logger.debug('checking navigator.serviceWorker');

  if (navigator.serviceWorker) {
    Logger.info('Service workers supported by this browser');
    return true;
  }

  Logger.warn('No, service workers are NOT supported by this browser');
  Logger.debug(navigator.userAgent);
  return false;
};

/*
 * @method isServiceWorkerControllingThisApp
 * Check whether a service worker is controlling the application
 * @returns {Boolean}
 */
SWUtil.prototype.isServiceWorkerControllingThisApp = function isServiceWorkerControllingThisApp() {
  Logger.newSection();
  Logger.log('SWUtil.isServiceWorkerControllingThisApp()');

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
};

/*
 * @method registerServiceWorker
 * Register a service worker
 * @param {String} path The script URL of the service worker to be registered
 * @param {String} scope (optional) The scope of the service worker to be registered
 * @returns {Promise}
 */
SWUtil.prototype.registerServiceWorker = function registerServiceWorker(scriptURL, scope) {
  var swRegisterSecondParam = {};

  Logger.newSection();
  Logger.log('SWUtil.registerServiceWorker()');

  Logger.info('Register service worker with serviceWorker.register()');

  Logger.debug('navigator.serviceWorker.register(scriptURL, scope)');
  Logger.debug('scriptURL: ' + scriptURL);

  // add optional parameter 'scope' if specified
  if (scope) {
    swRegisterSecondParam.scope = scope;
    Logger.debug('options.scope: ' + swRegisterSecondParam.scope);
  }

  // return a promise
  return new Promise(
    function then(resolve, reject) {
      navigator.serviceWorker.register(
        scriptURL,
        swRegisterSecondParam
      ).then(
        function registrationSuccess(swRegistration) {
          Logger.debug('registrationSuccess(swRegistration)');
          Logger.debug(swRegistration);

          if (swRegistration.active) {
            Logger.debug('Registering the active service worker again: ');
            Logger.debug(swRegistration.active.scriptURL + ' <= swRegistration.active.scriptURL');
          }

          if (swRegistration.installing) {
            Logger.debug('Registering the following service worker for the first time: ');
            Logger.debug(swRegistration.installing.scriptURL + ' <= swRegistration.installing.scriptURL');
          }

          if (swRegistration.scope) {
            Logger.debug('with scope: ' + swRegistration.scope + ' <= swRegistration.scope');
          }

          Logger.info('Service worker registered');
          Logger.info('Please enable and check the browser logs for the oninstall, onactivate, and onfetch events');
          Logger.info('SW is in control, once document is reloaded');
          Logger.debug('More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/');

          resolve();
        },
        function registrationError(why) {
          Logger.debug('registrationError(why)');
          Logger.error(why);

          reject();
        }
      );
    }
  );
};

/*
 * @method unregisterServiceWorker
 * Unregister the active service worker
 * @returns {Promise}
 */
SWUtil.prototype.unregisterServiceWorker = function unregisterServiceWorker() {
  Logger.newSection();
  Logger.log('SWUtil.unregisterServiceWorker()');

  Logger.debug('Unregistering the active service worker...');
  Logger.debug('if something goes wrong, please unregister the service worker ');
  Logger.debug('about:serviceworkers (Firefox) or chrome://serviceworker-internals/');

  // return a promise
  return new Promise(
    function then(resolve, reject) {
      Logger.debug('navigator.serviceWorker.getRegistration().then(success, error)');
      navigator.serviceWorker.getRegistration().then(
        function getRegistrationSuccess(swRegistration) {
          Logger.debug('getRegistrationSuccess(swRegistration)');
          Logger.debug(swRegistration);
          Logger.debug('Unregistering the following service worker: ' + swRegistration.active.scriptURL + ' <= swRegistration.active.scriptURL');
          Logger.debug('with scope ' + swRegistration.scope + ' <= swRegistration.scope');

          Logger.debug('swRegistration.unregister().then()');
          swRegistration.unregister()
            .then(
              function unregisterSuccess() {
                Logger.debug('unregisterSuccess()');
                Logger.info('The service worker has been successfully unregistered');
                Logger.debug('More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/');

                resolve();
              },
              function unregisterError(why) {
                Logger.debug('unregisterError(why)');
                Logger.error(why);

                reject();
              }
            );
        },
        function getRegistrationError(why) {
          Logger.debug('getRegistrationError(why)');
          Logger.error(why);
          Logger.warn('It has been not possibile to unregister the service worker');
        }
      );
    }
  );
};