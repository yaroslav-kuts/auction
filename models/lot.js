const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate = require('mongoose-paginate');

const lotSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
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
      type: Schema.ObjectId,
      ref: 'User'
    },
    location: String,
    arrivalType: {
        type: String,
        enum : ['pickup', 'royal', 'usaPostal', 'dhl'],
        default: 'pickup'
    },
    status: {
      type: String,
      enum : ['pending', 'sent', 'delivered'],
      default: 'pending'
    }
  }
});

lotSchema.plugin(paginate);

module.exports = mongoose.model('Lot', lotSchema);
