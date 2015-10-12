// import Logger from 'logger';
// import SWUtil from 'sw-util';

function App() {
  var _self = this;

  Logger.log('App()');

  // instatiate a new Service Worker Utility Class
  this.swUtil = new SWUtil();

  // register click events
  document.querySelector('#reloadapp').addEventListener('click', function() {
    window.location.reload();
  });

  // checking whether service workers are supported
  if (this.swUtil.areServiceWorkersSupported()) {
    document.querySelector('#swinstall').addEventListener('click', function() {
      Logger.log('\n-------\n');
      _self.enableCoolFeatures();
    });

    document.querySelector('#swuninstall').addEventListener('click', function() {
      Logger.log('\n-------\n');
      _self.disableCoolFeatures();
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

    this.swUtil.registerServiceWorker(
        this.disableServiceWorkerRegistration, // success
        this.enableServiceWorkerRegistration // error
    );
  },

  disableCoolFeatures: function disableCoolFeatures() {
    Logger.log('\nApp.disableCoolFeatures()');

    this.swUtil.unregisterServiceWorker(
        this.enableServiceWorkerRegistration, // success
        this.enableServiceWorkerRegistration // error
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
