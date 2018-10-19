const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  activated: {
    type: Boolean,
    default: true
  },
  tokens: Array,
  changePassToken: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
