// [Working example](/serviceworker-cookbook/fetching/).

self.oninstall = function(event) {
  console.log('DEBUG: service worker installed');
};

self.onfetch = function(event) {
  if (event.request.url.contains('cookbook-proxy')) {
    console.log('DEBUG: service worker proxy', event.request.url);
    var headers = new Headers();
    var init = { method: 'GET',
                 headers: headers,
                 mode: event.request.mode,
                 cache: 'default' };
    var url = event.request.url.split('cookbook-proxy/')[1];
    console.log('DEBUG: proxying', url);
    event.respondWith(fetch(url, init));
  } else {
    event.respondWith(fetch(event.request));
  }
};
