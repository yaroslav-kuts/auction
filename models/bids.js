const mongoose = require('./db');

const bidSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lot',
    required: true
  }
});

const Bid = mongoose.model('Bid', bidSchema);

const create = function (bid) {
  return new Promise((resolve, reject) => {
    Bid.create(bid, function(err, doc) {
        if (err) reject(err);
        console.log('Bid created!');
        resolve(doc);
      }
    );
  });
};

const truncate =  function () {
  return new Promise((resolve, reject) => {
    Bid.remove({}, function(err) {
      if (err) reject(err);
      console.log('Bid collection was cleaned!');
      counter = 0;
      resolve();
    });
  });
};

exports.truncate = truncate;
exports.create = create;
