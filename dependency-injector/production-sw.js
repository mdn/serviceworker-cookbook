/* global importScripts, onFetch, onInstall, onActivate, mapping */

importScripts('injector.js');

// The default mapping contains the map for abstract resources to their
// concrete counterparts.
importScripts('default-mapping.js');

// All the functionality is in `injector.js` here we only wire the listeners.
self.onfetch = onFetch;
self.oninstall = onInstall;
self.onactivate = onActivate;
