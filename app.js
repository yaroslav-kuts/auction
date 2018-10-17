const express = require('express');
const db = require('./models/db');

const app = express();

const close = (err, onclose) => {
  if (onclose) onclose();
  if (err) console.log(err.message);
  db.connection.close();
  process.exit();
};

app.get('/api/healthcheck', function (req, res) {
  res.status(200);
  res.json({ status: 'OK' });
});

app.listen(3001, function () {
  console.log('Auction app listening on port 3000!');
});

process.on('SIGINT', function() {
  close(null, () => {
    console.log('\nProcess was interupted!');
  });
});
