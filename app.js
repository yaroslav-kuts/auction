var express = require('express');

var app = express();

app.get('/', function (req, res) {
  res.send('Auction app!');
});

app.listen(3000, function () {
  console.log('Auction app listening on port 3000!');
});
