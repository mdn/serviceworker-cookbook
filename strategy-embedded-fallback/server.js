var MAX_IMAGES = 50;
var imageNumber = 0;

module.exports = function(app, route) {
  app.get(route + 'asset', function(req, res) {
    serveImage(res, 10000);
  });
};

var lastUpdate = -Infinity;

function serveImage(res, timeout) {
  var now = Date.now();
  if (now - lastUpdate > timeout) {
    imageNumber = (imageNumber + 1) % MAX_IMAGES;
    lastUpdate = Date.now();
  }
  var imageName = 'picture-' + (imageNumber + 1) + '.png';
  res.sendFile(imageName, { root: './imgs/random/' });
}
