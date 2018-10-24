const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  lot: {
    type: Schema.ObjectId,
    ref: 'Lot',
    required: true
  }
});

module.exports = mongoose.model('Bid', bidSchema);
