const express = require('express');
const app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res) {
	res.send('Hello World');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('app.listen on http://localhost:%d', port);
});
