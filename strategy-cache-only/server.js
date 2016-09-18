var temp = require('temp');
var request = require('request');
var fs = require('fs');

var cachedImagePath = temp.path();

module.exports = function(app, route) {
  app.get(route + 'asset', function(req, res) {
    serveImage(res, 10000);
  });
};

var lastUpdate = -Infinity;

function serveImage(res, timeout) {
  var now = Date.now();
  if (now - lastUpdate > timeout) {
    var diskResponse = fs.createWriteStream(cachedImagePath);
    request('http://lorempixel.com/300/300/').pipe(diskResponse);
    diskResponse.on('finish', function () {
      lastUpdate = Date.now();
      serveFromDisk(res);
    });
  } else {
    serveFromDisk(res);
  }
}

function serveFromDisk(res) {
  fs.createReadStream(cachedImagePath).pipe(res);
}
