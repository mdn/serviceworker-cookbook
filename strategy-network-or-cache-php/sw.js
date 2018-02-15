var CACHE = 'offline-cache';

self.addEventListener("install", function(e) {
    console.log('service worker install success');

    return e.waitUntil(function() {
        return caches.get(CACHE).then(function(cache) {
            return cache.addAll([
                './cached.html',
                './server.php'
            ]);
        })
    })
});

var fromNetwork = function(request, timeout) {
    return new Promise(function(resolve, reject) {
        var timeoutId = setTimeout(reject, timeout);

        fetch(request).then(function(response) {
            clearTimeout(timeoutId);
            console.log('resolve response');
            resolve(response);
        }, reject);
    })
};

function fromCache(request) {
    return caches.get(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            return matching || Promise.reject("no-match");
        })
    })
};

self.addEventListener("fetch", function(e) {
    e.respondWith(fromNetwork(e.request, 400).catch(function() {
        console.log('get data from cache');
        return fromCache(e.request);
    }))
});