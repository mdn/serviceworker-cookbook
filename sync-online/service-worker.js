// [Working example](/serviceworker-cookbook/sync-online/).

var CACHE_NAME = 'dependencies-cache';

// Files required to make this app work offline
var REQUIRED_FILES = [
  '/',
  'index.js'
];

// IndexedDB Settings
var DATABASE_NAME = 'blog';
var DATABASE_TABLE_NAME = 'posts';
var DATABASE_POST_ID = '1';

// Find indexedDB
self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
if (self.indexedDB) {
  // Initialize the database if necessary
  // Calling this every time in case the user manually deleted DB
  initializeDatabase();
} else {
  console.error('indexedDB not detected, this demo will not work as expected');
}

self.addEventListener('install', function(event) {
  // Perform install step:  loading each required file into cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Add all offline dependencies to the cache
        console.log('[install] Caches opened, adding all core components to cache');
        return cache.addAll(REQUIRED_FILES);
      })
      .then(function() {
        console.log('[install] All required resources have been cached, we\'re good!');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Only mock positive result if indexedDB is present
  // and if they've POST'ed
  if (self.indexedDB && event.request.url.indexOf('?') !== -1) {
    // Save!
    if (event.request.method === 'POST') {
      // Send the fetch to the server if online
      // We aren't concerned about the state of this because we have IndexDB as a backup
      fetch(event.request.clone());

      event.respondWith(
        event.request.json().then(function(json) {
          return managePostContent(json.content).then(function(content) {
            return new Response(content, {
              ok: true,
              status: '200',
              statusText: 'OK'
            });
          });
        })
      );
    } else { // Get!
      event.respondWith(
        managePostContent(null).then(function(content) {
          return new Response(JSON.stringify(content), {
            ok: true,
            status: '200',
            statusText: 'OK'
          });
        })
      );
    }
  } else {
    // Make network request
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('activate', function(event) {
  console.log('[activate] Activating ServiceWorker!');

  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  console.log('[activate] Claiming this ServiceWorker!');
  event.waitUntil(self.clients.claim());
});

function getDatabase() {
  return indexedDB.open(DATABASE_NAME, 3);
}

function initializeDatabase() {
  var DATABASE_REQUEST = getDatabase();
  DATABASE_REQUEST.onupgradeneeded = function(event) {
    console.log('Creating indexedDB database!');

    var db = event.target.result;

    // Create the table if needed
    var store = db.createObjectStore(DATABASE_TABLE_NAME, { keyPath: 'id' });

    // Create an indent on the posts table
    // Note: for this basic example, we'll always be updating the same post with the same ID
    store.createIndex('id', 'id', { unique: true });

    // Let's add a placeholder for our post
    store.add({
      id: DATABASE_POST_ID,
      content: 'Starting text...',
    }).onsuccess = function() {
      console.log('Stub record added to database successfully!');
    };
  };
}

// Can both get and set post content
function managePostContent(newContent) {
  return new Promise(function(resolve) {
    var DATABASE_REQUEST = getDatabase();

    DATABASE_REQUEST.onsuccess = function(event) {
      console.log('Connected to indexedDB successfully!');

      var db = event.target.result;
      var transaction = db.transaction([DATABASE_TABLE_NAME], 'readwrite');
      var store = transaction.objectStore(DATABASE_TABLE_NAME);
      var postRequest = store.get(DATABASE_POST_ID);

      postRequest.onsuccess = function() {
        var data = postRequest.result;

        // This is an update operation
        if (newContent !== null) {
          data.content = newContent;
          store.put(data).onsuccess = function() {
            resolve();
          };
        } else {
          // Simply retrieve and return the content;
          resolve(data);
        }
      };
    };
  });
}
