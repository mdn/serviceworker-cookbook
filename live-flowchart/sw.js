/*
 * This is a service worker
 */

console.debug('sw.js: this is a service worker');

/*
 * @listens install
 * Listens to the 'install' event
 */
this.addEventListener('install', function oninstall(event) {
  console.info('Service worker installed, oninstall fired');
  console.debug(event);

  // @PLEASEHACK: e.g. event.waitUntil(...);

  console.info('Use oninstall to install app dependencies');
});

/*
 * @listens activate
 * Listens to the 'activate' event
 */
this.addEventListener('activate', function onactivate(event) {
  console.info('Service worker activated, onactivate fired');
  console.debug(event);

  // @PLEASEHACK

  console.info('Use onactivate to cleanup old resources');
});

/*
 * @listens fetch
 * Listens to the 'fetch' event
 */
this.addEventListener('fetch', function onfetch(event) {
  console.info('onfecth fired');
  console.debug(event);

  // @PLEASEHACK: e.g. event.respondWith(...);

  console.info('Modify requests, do whatever you want');
});
