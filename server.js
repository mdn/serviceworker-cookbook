const express = require('express');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(function forceSSL(req, res, next) {
  const host = req.get('Host');
  if (!host.startsWith('localhost') {
    // https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security
    res.header('Strict-Transport-Security', 'max-age=15768000');
    //https://github.com/rangle/force-ssl-heroku/blob/master/force-ssl-heroku.js
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + host + req.url);
    }
  }
  return next();
});

app.use(function corsify(req, res, next) {
  // http://enable-cors.org/server_expressjs.html
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
