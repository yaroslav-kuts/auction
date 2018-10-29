require('dotenv').config();
const express = require('express');
const http = require('http');
const url = require('url');
let io = require('socket.io');
const bodyParser = require("body-parser");
const db = require('./db');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user');
const lotRoutes = require('./routes/lot');
const bidRoutes = require('./routes/bid');
const Bid = require('./models/bid');
const config = require('./config/config');

const app = express();

const server = http.createServer(app);

io = io(server);

app.use(function(req, res, next) {
    req.io = io;
    next();
});

app.use(bodyParser.urlencoded({ extended: true, limit: config.sizeLimit }));

app.use(bodyParser.json({ limit: config.sizeLimit }));

app.use(auth.initialize());

app.get('/api/healthcheck', (req, res) => res.json({ status: 'OK' }));

app.use('/api/user', userRoutes);
app.use('/api/lots', lotRoutes);
app.use('/api/bids', bidRoutes);

io.on('connection', async function(socket) {
    const lot = url.parse(socket.handshake.url, true).query.lot;
    socket.join(lot);
    const bids = await Bid.find({ lot }).exec();
    io.to(lot).emit('bid', JSON.stringify(bids));
    socket.on('close', () => console.log('Connection dropped!'));
});

app.use((err, req, res) => res.status(500).send({ error: err }));

server.listen(config.port, () => console.log(`App up on port ${config.port}`));

process.on('SIGINT', () => {
  db.close(null, () => {
    console.log('Process was interupted!');
  });
});
