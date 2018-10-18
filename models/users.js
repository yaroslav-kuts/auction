const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const bcrypt = require('bcrypt');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
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

  user.password = bcrypt.hashSync(user.password, 10);

  return new Promise((resolve, reject) => {
    User.create(user, function(err, doc) {
        if (err) reject(err);
        console.log('User created!');
        resolve(doc);
      }
    );
  });
};

const truncate = async () => User.remove({});

const count = () => User.count({}).exec();

exports.create = create;
exports.count = count;
exports.truncate = truncate;
