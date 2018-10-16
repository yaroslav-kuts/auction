const mongoose = require('mongoose');

const options = { poolSize: 10 };

mongoose.connect('mongodb://localhost/auction', options);

module.exports = mongoose;
