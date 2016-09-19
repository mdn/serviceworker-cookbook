// [Working example](/serviceworker-cookbook/fetching/).

// Create a proxy for all requests to the local urls containing a
// `cookbook-proxy` string.
self.onfetch = function(event) {
  if (event.request.url.includes('cookbook-proxy')) {
    var init = { method: 'GET',
                 mode: event.request.mode,
                 cache: 'default' };
    var url = event.request.url.split('cookbook-proxy/')[1];
    console.log('DEBUG: proxying', url);
    event.respondWith(fetch(url, init));
  } else {
    event.respondWith(fetch(event.request));
  }
};
