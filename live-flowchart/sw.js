console.debug('sw.js: this is a service worker');

// This is the basic architecture of a service worker, as described here:
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Basic_architecture

// With service workers, the following steps are generally observed for basic set up:

// (1) The service worker URL is fetched and registered via serviceWorker.register().

// (2) If successful, the service worker is executed in a ServiceWorkerGlobalScope;
// this is basically a special kind of worker context, running off the main script execution thread, with no DOM access.

// (3) The service worker is now ready to process events.

// (4) Installation of the worker is attempted when service worker-controlled pages are accessed subsequently.
this.addEventListener('install', function oninstall(event) {
  console.info('Service worker installed, oninstall fired');
  console.debug(event);

  // An Install event is always the first one sent to a service worker (this can be used to start the process of populating an IndexedDB, and caching site assets say).
  // This is really the same kind of procedure as installing a native or Firefox OS app — making everything available for use offline.

  console.info('Use oninstall to install app dependencies');

  // (5) When the oninstall handler completes, the service worker is considered installed.
});

// (6) Next is activation. When the service worker is installed, it then receives an activate event.
this.addEventListener('activate', function onactivate(event) {
  console.info('Service worker activated, onactivate fired');
  console.debug(event);

  // The primary use of onactivate is for cleanup of resources used in previous versions of a Service Worker script.

  console.info('Use onactivate to cleanup old resources');
});

// (7) The Service Worker will now control pages, but only those opened after the register() is successful.
// i.e. a document starts life with or without a Service Worker and maintains that for its lifetime.
// So documents will have to be reloaded to actually be controlled.

this.addEventListener('fetch', function onfetch(event) {
  console.info('onfecth fired');
  console.debug(event);

  console.info('Modify requests, do whatever you want');
});
