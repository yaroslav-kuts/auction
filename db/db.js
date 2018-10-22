const mongoose = require('mongoose');

const options = { poolSize: 10, useNewUrlParser: true };

mongoose.connect('mongodb://localhost/auction', options);

exports.close = (err, onclose) => {
  if (onclose) onclose();
  if (err) console.log(err.message);
  mongoose.connection.close();
  process.exit();
};
