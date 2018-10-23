require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const db = require('./db/db');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user.js');
const lotRoutes = require('./routes/lot.js');
const config = require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: config.sizeLimit }));

app.use(bodyParser.json({ limit: config.sizeLimit }));

app.use(auth.initialize());

app.get('/api/healthcheck', function (req, res) {
  return res.json({ status: 'OK' });
});

app.use('/api/user', userRoutes);
app.use('/api/lots', lotRoutes);

app.use(function(err, req, res, next) {
  res.status(500).send({ error: err });
});

app.listen(config.port, function () {
  console.log(`Auction app listening on port ${config.port}!`);
});

process.on('SIGINT', function() {
  db.close(null, () => {
    console.log('Process was interupted!');
  });
});
