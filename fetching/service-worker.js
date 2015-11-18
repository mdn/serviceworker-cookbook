// [Working example](/serviceworker-cookbook/fetching/).

self.onfetch = function(event) {
  if (event.request.url.contains('cookbook-proxy')) {
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
