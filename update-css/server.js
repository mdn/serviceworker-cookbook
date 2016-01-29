var currentJSONid = 0;
var currentJSONs = [
  { id: 0, files: [{ name: 'style-0.css', cacheAs: 'style.css' },
                   { name: 'style-shared.css', cacheAs: 'style-shared.css' },
                   { name: 'cat.jpg', cacheAs: 'cat.jpg' }] },
  { id: 1, files: [{ name: 'style-1.css', cacheAs: 'style.css' },
                   { name: 'style-shared.css', cacheAs: 'style-shared.css' },
                   { name: 'monalisa.jpg', cacheAs: 'monalisa.jpg' }] },
];

module.exports = function(app, route) {
  app.get(route + 'current.json', function(req, res) {
    res.status(200).json(currentJSONs[currentJSONid]);
  });

  app.post(route + 'update-resources', function(req, res) {
    currentJSONid = (currentJSONid + 1) % currentJSONs.length;
    res.status(201).json(currentJSONs[currentJSONid]);
  });
}
