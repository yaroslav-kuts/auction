const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const mailer = require('../helpers/mailer');

const jwtsecret = 'mysecret';

const confirm = function (req, res) {
  const email = req.params.email;
  User.update({ email: email }, {$set : { activated: true }}, function (err) {
    if (err) {
      console.log(err);
      res.status(500);
      res.json({ message: 'Error during user account confirmation!' });
    }
    res.status(200);
    res.json({ message: `${email} was activated!` });
  });
};

const signup = function (req, res) {
  //TODO: add body validation
  console.log(req.body);

  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);

  User.create(user, function(err, doc) {
    if (err) console.log(err);
    console.log('User created!');
  });

  const email = {
    from: `zndtestdev@gmail.com`,
    to: user.email,
    subject: `Auction Marketplace: Signup confirmation!`,
    html: `<p>To confirm registration follow the link: <a href="http://localhost:3001/api/user/confirm/${req.body.email}">confirmation</a></p>`
  };

  mailer.send(email);
  res.status(200);
  res.json(user);
};

const login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.status(401);
      res.json({ status: 'Unauthorized' });
    }
    if (!user) {
      res.status(401);
      res.json({ status: 'Unauthorized' });
    }
    else {
      const payload = {
        id: user._id,
        email: user.email
      };
      const token = jwt.sign(payload, jwtsecret, { expiresIn: '2h' });
      res.json({ user: user.email, token: `JWT ${token}`});
    }
  })(req, res, next);
};

const checkauth = function(req, res) {
  try {
    var decoded = jwt.verify(req.get('auth'), jwtsecret);
  } catch (err) {
    res.json({ error: err});
  }
  res.json({ id: decoded.id,
             email: decoded.email,
             expiration: new Date(decoded.exp * 1000),
             isValid: decoded.exp > Date.now() / 1000 });
};

exports.confirm = confirm;
exports.signup = signup;
exports.login = login;
exports.checkauth = checkauth;
