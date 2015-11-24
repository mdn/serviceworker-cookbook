/* global importScripts, onFetch, onInstall, onActivate, mapping */

importScripts('injector.js');

// Load the default mapping between abstract and concrete resources.
importScripts('default-mapping.js');

// But override ``utils/dialogs`` to serve the mockup instead.
mapping['utils/dialogs'] = 'mock-dialogs.js';

self.onfetch = onFetch;
self.oninstall = onInstall;
self.onactivate = onActivate;
