'use strict'; // to support classes in Chrome (Version 48.0.2527.0 canary (64-bit))

// import Logger from 'logger'; // not supported in Chrome (Version 48.0.2527.0 canary (64-bit))

class SWUtil {

  constructor() {
    Logger.log('\nSWUtil()');
  }

  areServiceWorkersSupported() {
    Logger.log('\nSWUtil.areServiceWorkersSupported()');

    Logger.debug('checking navigator.serviceWorker');

    if (navigator.serviceWorker) {
      Logger.info('Service workers supported by this browser');
      return true;
    }

    Logger.warn('No, service workers are NOT supported by this browser');
    return false;
  }

  isServiceWorkerControllingThisApp() {
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
  }

  registerServiceWorker(serviceWorkerRegistered, serviceWorkerNotRegistered) {
    Logger.log('\nSWUtil.registerServiceWorker()');

    Logger.info('Register service worker with serviceWorker.register()');

    Logger.debug('navigator.serviceWorker.register(\'./sw.js\', { scope: \'./\' }).then(success, error)');
    navigator.serviceWorker.register(
      './sw.js',
      { scope: './' }
    ).then(
      (swRegistration) => {
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

        serviceWorkerRegistered();
      },
      (why) => {
        Logger.debug('error(why)');
        Logger.log(why);

        serviceWorkerNotRegistered();
      }
    );
  }

  unregisterServiceWorker(serviceWorkerUnregistered, serviceWorkerNotUnregistered) {
    Logger.log('\nSWUtil.unregisterServiceWorker()');

    Logger.debug('navigator.serviceWorker.getRegistration().then(success, error)');
    navigator.serviceWorker.getRegistration().then(
      (swRegistration) => {
        Logger.debug('success(swRegistration)');
        Logger.debug(swRegistration);
        Logger.debug('Unregistering the following service worker: ' + swRegistration.active.scriptURL + ' <= swRegistration.active.scriptURL');
        Logger.debug('with scope ' + swRegistration.scope + ' <= swRegistration.scope');

        Logger.debug('swRegistration.unregister().then()');
        swRegistration.unregister()
          .then(
            () => {
              Logger.debug('success()');
              Logger.info('The service worker has been successfully unregistered');
              Logger.debug('More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/');

              serviceWorkerUnregistered();
            },
            (why) => {
              Logger.debug('error(why)');
              Logger.error(why);

              serviceWorkerNotUnregistered();
            }
          );
      },
      (why) => {
        Logger.debug('error(why)');
        Logger.debug(why);
        Logger.warn('It has been not possibile to unregister the service worker');
        Logger.debug('Please unregister the service worker using about:serviceworkers (Firefox) or chrome://serviceworker-internals/');
      }
    );
  }

}
