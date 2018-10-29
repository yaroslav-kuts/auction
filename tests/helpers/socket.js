const config = require('../../config/config');

module.exports = (lot, callback) => {
    const socket = require('socket.io-client')(`http://localhost:${config.port}`, { query: `lot=${lot}` });

    socket.on('connect', () => console.log('Connected'));

    socket.on('bid', (data) => {
        callback(data);
    });

    socket.on('disconnect', () => console.log('Disconnected'));

    return socket;
};