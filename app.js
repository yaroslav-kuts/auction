const express = require('express');
const db = require('./models/db');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user.js');
const config = require('./config/config');

const app = express();

const close = (err, onclose) => {
  if (onclose) onclose();
  if (err) console.log(err.message);
  db.connection.close();
  process.exit();
};

app.use(auth.initialize());

app.get('/api/healthcheck', function (req, res) {
  return res.json({ status: 'OK' });
});

app.use('/api/user', userRoutes);

app.use(function(err, req, res) {
  res.status(500).send({ error: err });
});

app.listen(config.port, function () {
  console.log(`Auction app listening on port ${config.port}!`);
});

process.on('SIGINT', function() {
  close(null, () => {
    console.log('Process was interupted!');
  });
});
