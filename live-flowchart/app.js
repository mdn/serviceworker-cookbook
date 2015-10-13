/* global Logger, SWUtil */

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

  enableCoolFeatures: function enableCoolFeatures() {
    Logger.log('\nApp.enableCoolFeatures()');

    Logger.log('Configuring service worker');

    this.swUtil.registerServiceWorker().then(
        this.disableServiceWorkerRegistration, // success
        this.enableServiceWorkerRegistration // error
    );
  },

  disableCoolFeatures: function disableCoolFeatures() {
    Logger.log('\nApp.disableCoolFeatures()');

    this.swUtil.unregisterServiceWorker().then(
        this.enableServiceWorkerRegistration, // success
        this.disableServiceWorkerRegistration // error
    );
  },

  enableServiceWorkerRegistration: function enableServiceWorkerRegistration() {
    document.querySelector('#swinstall').disabled = false;
    document.querySelector('#swuninstall').disabled = true;
  },

  disableServiceWorkerRegistration: function disableServiceWorkerRegistration() {
    document.querySelector('#swinstall').disabled = true;
    document.querySelector('#swuninstall').disabled = false;
  },
};

// starts the application
new App();
