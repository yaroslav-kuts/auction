var express = require('express');

var app = express();

app.get('/api/healthcheck', function (req, res) {
  res.status(200);
  res.json({ status: 'OK' });
});

app.listen(3000, function () {
  console.log('Auction app listening on port 3000!');
});
