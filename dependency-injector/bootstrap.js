
// This would be the framework bootstrap script, injected in the template HTML
// when building the application.

// We switch between production and testing environments by checking
// the hash of the URL.
window.onhashchange = function() {
  var injector = window.location.hash.substr(1) || 'production';
  var currentInjector = getCurrentInjector();

  if (injector !== currentInjector) {
    // When the new injector is activated, reload...
    navigator.serviceWorker.oncontrollerchange = function() {
      this.controller.onstatechange = function() {
        // ...if this were a real framework, instead of reloading we would
        // start to load the view scripts in an asynchronous way but providing
        // such mechanisms is out of the scope of this demo.
        if (this.state === 'activated') {
          window.location.reload();
        }
      };
    };
    registerInjector(injector);
  }
};

// Force the initial check.
window.onhashchange();

// Register one or another Service Worker depending on the type of environment.
function registerInjector(injector) {
  var injectorUrl = injector + '-sw.js';
  return navigator.serviceWorker.register(injectorUrl);
}

// Gets the current injector inspecting the service worker registered, if any.
function getCurrentInjector() {
  var injector;
  var controller = navigator.serviceWorker.controller;
  if (controller) {
    injector = controller.scriptURL.endsWith('production-sw.js')
                 ? 'production' : 'testing';
  }
  return injector;
}
