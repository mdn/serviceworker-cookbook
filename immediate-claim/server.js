var path = require('path');
var swig = require('swig');
var request = require('request');

module.exports = function autoClaim(app, route) {
  var tpl = swig.compileFile(path.join(__dirname, './service-worker.js'));

  app.get(route + 'service-worker.js', function getServiceWorker(req, res) {
    // Get current time with 10sec accuracy, so the generated ServiceWorker
    // is updated every 10sec
    var nowMinute = new Date();
    nowMinute.setSeconds(Math.floor(nowMinute.getSeconds() / 5) * 5);
    // Replace {{ version }} service-worker.js
    var buffer = tpl({
      version: [
        nowMinute.getFullYear(),
        nowMinute.getMonth(),
        nowMinute.getDate(),
        [
          nowMinute.getHours(),
          nowMinute.getMinutes(),
          nowMinute.getSeconds()
        ].join(':')
      ].join('-')
    });
    res.type('js').send(buffer);
  });

  app.get(route + 'random-cached.jpg', function getRandom(req, res) {
    request('http://lorempixel.com/200/100/').pipe(res);
  });
};
