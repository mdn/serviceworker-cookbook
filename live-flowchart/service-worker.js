console.debug('service-worker.js: this is a service worker');

// This is the basic architecture of a service worker, as described [here](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Basic_architecture "Service Worker architecture").

// With service workers, the following steps are generally observed for basic set up:

// <h2>1</h2> The service worker URL is fetched and registered via <code>serviceWorker.register()</code>.
// This step is performed in the [SWUtil module](sw-util.html "the module using navigator.serviceWorker").

// <h2>2</h2> If successful, the service worker is executed in a <code>ServiceWorkerGlobalScope</code>;
// this is basically a special kind of worker context, running off the main script execution thread, with no DOM access.

// <h2>3</h2> The service worker is now ready to process events.

// <h2>4</h2> Installation of the worker is attempted when service worker-controlled pages are accessed subsequently.
this.addEventListener('install', function oninstall(event) {
  console.info('Service worker installed, oninstall fired');
  console.debug(event);

  // An <code>install</code> event is always the first one sent to a service worker (this can be used to start the process of populating an [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API "IndexedDB documentation on MDN"), and caching site assets say).
  // This is really the same kind of procedure as installing a native or Firefox OS app — making everything available for use offline.

  // More info about how to handle the <code>InstallEvent</code> are [here](https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent "InstallEvent on MDN")
  console.info('Use oninstall to install app dependencies');

  // <h2>5</h2> When the <code>oninstall</code> handler completes, the service worker is considered installed.
});

// <h2>6</h2> Next is <code>activation</code>. When the service worker is installed, it then receives an activate event.
this.addEventListener('activate', function onactivate(event) {
  console.info('Service worker activated, onactivate fired');
  console.debug(event);

  // The primary use of <code>onactivate</code> is for cleanup of resources used in previous versions of a Service Worker script.
  console.info('Use onactivate to cleanup old resources');
});

// <h2>7</h2> The Service Worker will now control pages, but only those opened after the <code>register()</code> is successful.
// i.e. a document starts life with or without a Service Worker and maintains that for its lifetime.
// So documents will have to be reloaded to actually be controlled.

this.addEventListener('fetch', function onfetch(event) {
  console.info('onfecth fired');
  console.debug(event);

  // More info about how to handle the <code>FetchEvent</code> are [here](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent "FetchEvent on MDN")
  console.info('Modify requests, do whatever you want');
});
