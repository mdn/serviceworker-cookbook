/* global Logger, SWUtil */

// <h2>App</h2>
// This recipe
function App() {
  this.constructor();
}

// <h3>App constructor</h3>
App.prototype.constructor = function constructor() {
  var thisapp = this;

  Logger.log('App started');

  // instatiate a new Service Worker helper
  this.swUtil = new SWUtil();

  // register click events
  document.querySelector('#reloadapp').addEventListener('click', function() {
    window.location.reload();
  });

  // checking whether service workers are supported
  if (this.swUtil.areServiceWorkersSupported()) {
    document.querySelector('#swinstall').addEventListener('click',
      function() {
        thisapp.enableCoolFeatures();
      }
    );

    document.querySelector('#swuninstall').addEventListener('click',
      function() {
        thisapp.disableCoolFeatures();
      }
    );

    // checking whether a service worker is in control
    if (this.swUtil.isServiceWorkerControllingThisApp()) {
      Logger.info('App code run as expected');

      this.disableSWRegistration();
    } else {
      this.enableSWRegistration();
    }
  } else {
    Logger.error('Service workers are not supported by this browser');
  }
};

// <h3>Enable cool features</h3>
// Try to register a service worker in order to enable cool features (e.g. cache, offline navigation, ...)
App.prototype.enableCoolFeatures = function enableCoolFeatures() {
  var scriptURL;
  var scope;

  Logger.newSection();
  Logger.log('Enabling cool features...');

  // get params from DOM inputs
  scriptURL = document.querySelector('#swscripturl');
  scope = document.querySelector('#swscope');

  Logger.debug(
    'Configuring the following service worker ' + scriptURL.value +
    ' with scope ' + scope.value
  );

  if (scriptURL.value !== '') {
    Logger.debug('scriptURL: ' + scriptURL.value);
  } else {
    Logger.error('No SW scriptURL specified');
    return;
  }

  if (scope.value !== '') {
    Logger.debug('scope: ' + scope.value);
  } else {
    Logger.warn('scope: not specified ' +
      '(scope defaults to the path the script sits in)'
    );
  }

  // register the specified service worker
  this.swUtil.registerServiceWorker(scriptURL.value, scope.value).then(
      this.disableSWRegistration, // success
      this.enableSWRegistration // error
  );
};

// <h3>Disable cool features</h3>
// Try to unregister the active service worker in order to disable cool features
App.prototype.disableCoolFeatures = function disableCoolFeatures() {
  Logger.newSection();
  Logger.log('Disabling cool features...');

  this.swUtil.unregisterServiceWorker().then(
      this.enableSWRegistration, // success
      this.disableSWRegistration // error
  );
};

// <h3>Enable Service Worker Registration</h3>
// Enable the possibility for the user to register a service worker
App.prototype.enableSWRegistration = function() {
  document.querySelector('#swinstall').disabled = false;
  document.querySelector('#swuninstall').disabled = true;
};

// <h3>Disable Service Worker Registration</h3>
// Disable the possibility for the user to unregister a service worker
App.prototype.disableSWRegistration = function() {
  document.querySelector('#swinstall').disabled = true;
  document.querySelector('#swuninstall').disabled = false;
};

// starts the application
var app = new App();
console.debug(app);
