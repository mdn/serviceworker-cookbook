'use strict'; // to support classes in Chrome (Version 48.0.2527.0 canary (64-bit))

// import Logger from 'logger'; // not supported in Chrome (Version 48.0.2527.0 canary (64-bit))
// import SWUtil from 'sw-util'; // not supported in Chrome (Version 48.0.2527.0 canary (64-bit))

class App {

  constructor() {
    const _self = this;

    Logger.log('App()');

    this.swUtil = new SWUtil();

    if (this.swUtil.areServiceWorkersSupported()) {
      document.querySelector('#swinstall').addEventListener('click', () => {
        Logger.log('\n-------\n');
        _self.enableCoolFeatures();
      });

      document.querySelector('#reloadapp').addEventListener('click', () => {
        window.location.reload();
      });

      document.querySelector('#swuninstall').addEventListener('click', () => {
        Logger.log('\n-------\n');
        _self.disableCoolFeatures();
      });

      if (this.swUtil.isServiceWorkerControllingThisApp()) {
        Logger.info('App code run as expected');

        this.enableServiceWorkerRegistration();
      } else {
        this.enableServiceWorkerUnregistration();
      }
    } else {
      Logger.error('Service workers are not supported by this browser');
      Logger.error(navigator.userAgent);
    }
  }

  enableCoolFeatures() {
    Logger.log('\nApp.enableCoolFeatures()');

    Logger.log('Configuring service worker');

    this.swUtil.registerServiceWorker(
      this.coolFeaturesAvailable, // success
      this.coolFeaturesNotAvailable // error
    );
  }

  disableCoolFeatures() {
    Logger.log('\nApp.disableCoolFeatures()');

    this.swUtil.unregisterServiceWorker(
      this.coolFeaturesDisabled, // success
      this.coolFeaturesNotDisabled // error
    );
  }

  coolFeaturesAvailable() {
    Logger.log('\nApp.coolFeaturesAvailable()');

    document.querySelector('#swinstall').disabled = true;
    document.querySelector('#swuninstall').disabled = false;

    Logger.info('Service worker installed: check the browser logs for the oninstall, onactivate and onfetch events');
  }

  coolFeaturesNotAvailable() {
    Logger.log('\nApp.coolFeaturesNotAvailable()');

    document.querySelector('#swinstall').disabled = false;
    document.querySelector('#swuninstall').disabled = true;
  }

  coolFeaturesDisabled() {
    Logger.log('\nApp.coolFeaturesDisabled()');

    document.querySelector('#swinstall').disabled = false;
    document.querySelector('#swuninstall').disabled = true;
  }

  coolFeaturesNotDisabled() {
    Logger.log('\nApp.coolFeaturesNotDisabled()');

    document.querySelector('#swinstall').disabled = true;
    document.querySelector('#swuninstall').disabled = false;
  }

  enableServiceWorkerRegistration() {
    document.querySelector('#swinstall').disabled = true;
    document.querySelector('#swuninstall').disabled = false;
  }

  enableServiceWorkerUnregistration() {
    document.querySelector('#swinstall').disabled = false;
    document.querySelector('#swuninstall').disabled = true;
  }
}
