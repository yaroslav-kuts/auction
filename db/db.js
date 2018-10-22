const mongoose = require('mongoose');
const config = require('../config/config');

const options = { poolSize: config.poolSize, useNewUrlParser: true };

mongoose.connect(process.env.DB_URI, options);

exports.close = (err, onclose) => {
  if (onclose) onclose();
  if (err) console.log(err.message);
  mongoose.connection.close();
  process.exit();
};
