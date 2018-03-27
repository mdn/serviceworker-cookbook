// [Working example](/serviceworker-cookbook/local-download/).

// Listen on fetch events for posts to download-file
self.addEventListener('fetch', function(event) {
  // If the request is going to the download-file endpoint, parse the post data and return a file. 
  // This can be paired with a server side function with the same behavior as a fallback.
  if(event.request.url.indexOf("download-file") !== -1) {
    event.respondWith(event.request.formData().then(function (formdata){
      var filename = formdata.get("filename");
      var body = formdata.get("filebody");
      var response = new Response(body);
      response.headers.append('Content-Disposition', 'attachment; filename="' + filename + '"');
        return response;
      }));
    }
});
