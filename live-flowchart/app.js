/* global Logger, SWUtil */

/*
 * @class App
 * This application
 */
function App() {
  var app = this;

  Logger.log('App()');

  // instatiate a new Service Worker Utility Class
  this.swUtil = new SWUtil();

  // register click events
  document.querySelector('#reloadapp').addEventListener('click', function onreloadapp() {
    window.location.reload();
  });

  // checking whether service workers are supported
  if (this.swUtil.areServiceWorkersSupported()) {
    document.querySelector('#swinstall').addEventListener('click', function onswinstall() {
      Logger.log('\n-------\n');
      app.enableCoolFeatures();
    });

    document.querySelector('#swuninstall').addEventListener('click', function onswuninstall() {
      Logger.log('\n-------\n');
      app.disableCoolFeatures();
    });

    // checking whether a service worker is in control
    if (this.swUtil.isServiceWorkerControllingThisApp()) {
      Logger.info('App code run as expected');

      this.disableServiceWorkerRegistration();
    } else {
      this.enableServiceWorkerRegistration();
    }
  } else {
    Logger.error('Service workers are not supported by this browser');
  }
}

App.prototype = {

  /*
   * @method enableCoolFeatures
   * Try register a service worker in order to enable cool features (e.g. offline navigation)
   */
  enableCoolFeatures: function enableCoolFeatures() {
    var scriptURL = null;
    var scope = null;

    Logger.log('\nApp.enableCoolFeatures()');

    // get params from DOM inputs
    scriptURL = document.querySelector('#swscripturl');
    scope = document.querySelector('#swscope');

    Logger.debug('Configuring the following service worker ' + scriptURL.value + ' with scope ' + scope.value);

    if (scriptURL.value !== '') {
      Logger.debug('scriptURL: ' + scriptURL.value);
    } else {
      Logger.error('No SW scriptURL specified');
      return;
    }

    if (scope.value !== '') {
      Logger.debug('scope: ' + scope.value);
    } else {
      Logger.warn('scope: not specified (scope defaults to the path the script sits in)');
    }

    // register the specified service worker
    this.swUtil.registerServiceWorker(scriptURL.value, scope.value).then(
        this.disableServiceWorkerRegistration, // success
        this.enableServiceWorkerRegistration // error
    );
  },

  /*
   * @method disableCoolFeatures
   * Try unregister the active service worker in order to disable cool features (e.g. offline navigation)
   */
  disableCoolFeatures: function disableCoolFeatures() {
    Logger.log('\nApp.disableCoolFeatures()');

    this.swUtil.unregisterServiceWorker().then(
        this.enableServiceWorkerRegistration, // success
        this.disableServiceWorkerRegistration // error
    );
  },

  /*
   * @method enableServiceWorkerRegistration
   * Enable the possibility for the user to register a service worker
   */
  enableServiceWorkerRegistration: function enableServiceWorkerRegistration() {
    document.querySelector('#swinstall').disabled = false;
    document.querySelector('#swuninstall').disabled = true;
  },

  /*
   * @method disableServiceWorkerRegistration
   * Disable the possibility for the user to unregister a service worker
   */
  disableServiceWorkerRegistration: function disableServiceWorkerRegistration() {
    document.querySelector('#swinstall').disabled = true;
    document.querySelector('#swuninstall').disabled = false;
  },
};

// starts the application
new App();
