const mongoose = require('mongoose');

const options = { poolSize: 10, useNewUrlParser: true };

mongoose.connect('mongodb://localhost/auction', options);
