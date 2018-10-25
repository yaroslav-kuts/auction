require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const db = require('./db/db');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user.js');
const lotRoutes = require('./routes/lot.js');
const bidRoutes = require('./routes/bid.js');
const config = require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: config.sizeLimit }));

app.use(bodyParser.json({ limit: config.sizeLimit }));

app.use(auth.initialize());

app.get('/api/healthcheck', (req, res) => res.json({ status: 'OK' }));

app.use('/api/user', userRoutes);
app.use('/api/lots', lotRoutes);
app.use('/api/bids', bidRoutes);

app.use((err, req, res) => res.status(500).send({ error: err }));

app.listen(config.port, () => console.log(`App up on port ${config.port}`));

process.on('SIGINT', () => {
  db.close(null, () => {
    console.log('Process was interupted!');
  });
});
