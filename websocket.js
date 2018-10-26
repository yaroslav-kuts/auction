const WebSocketServer = new require('ws');
const Bid = require('./models/bid.js');

const webSocketServer = new WebSocketServer.Server({ port: 8081 });

const update = async (ws, lot) => {
  const bids = await Bid.find({ lot });
  ws.send(bids.toString());
};

webSocketServer.on('connection', async function(ws, req) {
  const lot = req.url.replace('/', '');
  update(ws, lot);

  ws.on('message', function(message) {
    console.log(`Message: ${message}`);
  });

  ws.on('close', function() {
    console.log('Connection dropped!');
  });
});
