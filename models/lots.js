const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const lotSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: String,
  description: String,
  status: {
      type: String,
      enum : ['pending', 'inProgress', 'closed'],
      default: 'pending',
      required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  estimatedPrice: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  order: {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: String,
    arrivalType: {
        type: String,
        enum : ['pickup', 'royalMail', 'unitedStatesPostalService', 'dhlExpress'],
        default: 'pickup'
    },
    status: {
      type: String,
      enum : ['pending', 'sent', 'delivered'],
      default: 'pending'
    }
  }
});

module.exports = mongoose.model('Lot', lotSchema);
