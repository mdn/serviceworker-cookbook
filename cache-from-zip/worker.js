/* global importScripts, zip */

importScripts('./lib/zip.js');
importScripts('./lib/ArrayBufferReader.js');
importScripts('./lib/deflate.js');
importScripts('./lib/inflate.js');

var ZIP_URL = './package.zip';
zip.useWebWorkers = false;

// During installation, extend the event to recover the package
// for this recipe and install into an offline cache.
self.oninstall = function(event) {
  event.waitUntil(
    fetch(ZIP_URL)
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(getZipReader)
      .then(cacheContents)
      .then(self.skipWaiting.bind(self)) // control clients ASAP
  );
};

// Control the clients as soon as possible.
self.onactivate = function(event) {
  event.waitUntil(self.clients.claim());
};

// Answer by querying the cache. If fail, go to the network.
self.onfetch = function(event) {
  event.respondWith(openCache().then(function(cache) {
    return cache.match(event.request).then(function(response) {
      return response || fetch(event.request);
    });
  }));
};

// This wrapper promisifies the zip.js API for reading a zip.
function getZipReader(data) {
  return new Promise(function(fulfill, reject) {
    zip.createReader(new zip.ArrayBufferReader(data), fulfill, reject);
  });
}

// Use the reader to read each of the files inside the zip
// and put them into the offline cache.
function cacheContents(reader) {
  return new Promise(function(fulfill, reject) {
    reader.getEntries(function(entries) {
      console.log('Installing', entries.length, 'files from zip');
      Promise.all(entries.map(cacheEntry)).then(fulfill, reject);
    });
  });
}

// Cache one entry, skipping directories.
function cacheEntry(entry) {
  if (entry.directory) { return Promise.resolve(); }

  return new Promise(function(fulfill, reject) {
    // The writer specifies the format for the data to be read as.
    // This case, we want a generic blob as blob is one of the supported
    // formats for the `Response` constructor.
    entry.getData(new zip.BlobWriter(), function(data) {
      return openCache().then(function(cache) {
        var location = getLocation(entry.filename);
        var response = new Response(data, { headers: {
          // As the zip says nothing about the nature of the file, we extract
          // this information from the file name.
          'Content-Type': getContentType(entry.filename)
        } });

        console.log('-> Caching', location,
                    '(size:', entry.uncompressedSize, 'bytes)');

        // If the entry is the index, cache its contents for root as well.
        if (entry.filename === 'index.html') {
          // Response are one-use objects, as `.put()` consumes the data in the body
          // we need to clone the response in order to use it twice.
          cache.put(getLocation(), response.clone());
        }

        return cache.put(location, response);
      }).then(fulfill, reject);
    });
  });
}

// Return the location for each entry.
function getLocation(filename) {
  return location.href.replace(/worker\.js$/, filename || '');
}

var contentTypesByExtension = {
  'css': 'text/css',
  'js': 'application/javascript',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'html': 'text/html',
  'htm': 'text/html'
};

// Return the content type of a file based on the name extension
function getContentType(filename) {
  var tokens = filename.split('.');
  var extension = tokens[tokens.length - 1];
  return contentTypesByExtension[extension] || 'text/plain';
}

// Opening a cache is an expensive operation. By caching the promise
// returned by `cache.open()` we only open the cache once.
var cachePromise;
function openCache() {
  if (!cachePromise) { cachePromise = caches.open('cache-from-zip'); }
  return cachePromise;
}
