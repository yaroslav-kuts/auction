const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const bidSchema = new Schema({
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

module.exports = mongoose.model('Bid', bidSchema);
