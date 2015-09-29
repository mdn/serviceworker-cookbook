const express = require('express');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(function forceSSL(req, res, next) {
  const host = req.get('Host');
  if (!host.startsWith('localhost') && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + host + req.url);
  }
  return next();
});

// http://enable-cors.org/server_expressjs.html
app.use(function corsify(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

glob.sync('./*/server.js').map(function requireRecipe(file) {
  const route = '/' + path.basename(path.dirname(file)) + '/';
  console.log('require', route);
  require(file)(app, route);
});

const pub = fs.existsSync('./dist') ? './dist' : './';
app.use(express.static(pub));

const port = process.env.PORT || 3003;
app.listen(port, function didListen() {
  console.log('app.listen on http://localhost:%d', port);
});
