const mongoose = require('./db');
const uniqueValidator = require('mongoose-unique-validator');

let counter = 0;

const userSchema = new mongoose.Schema({
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

const User = mongoose.model('User', userSchema);

const create = function (user) {
  return new Promise((resolve, reject) => {
    User.create(user, function(err, doc) {
        if (err) reject(err);
        console.log('User created!');
        counter++;
        resolve(doc);
      }
    );
  });
};

const truncate =  function () {
  return new Promise((resolve, reject) => {
    User.remove({}, function(err) {
      if (err) reject(err);
      console.log('Users collection was cleaned!');
      counter = 0;
      resolve();
    });
  });
};

const count = function () {
  return counter;
};

exports.create = create;
exports.count = count;
exports.truncate = truncate;
