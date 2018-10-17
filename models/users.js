const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

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
