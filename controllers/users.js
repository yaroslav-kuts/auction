const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

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
      const jti = uniqid();
      console.log(jti);
      const payload = {
        id: user._id,
        email: user.email,
        jti: jti
      };
      const token = jwt.sign(payload, jwtsecret, { expiresIn: '2h' });
      user.tokens.push(jti);
      User.update({ email: user.email }, user, function (err) {
        if (err) res.json({ error: err });
        res.json({ user: user.email, token: `JWT ${token}`});
      });
    }
  })(req, res, next);
};

const logout = function (req, res, next) {
  const token = req.get('auth');
  const decoded = jwt.verify(token, jwtsecret);
  User.findOne({ email: decoded.email }, function (err, user) {
    const indexOfToken = user.tokens.indexOf(decoded.jti);
    const tokens = user.tokens.slice(0, indexOfToken).concat(user.tokens.slice(indexOfToken+1));
    user.tokens = tokens;
    User.update({ email: user.email }, user, function (err) {
      if (err) res.json({ error: err });
      res.json({ logout: 'successful' });
    });
  });
};

const checkauth = function(req, res) {
  try {
    var decoded = jwt.verify(req.get('auth'), jwtsecret);
    User.findOne({ email: decoded.email }, (err, user) => {
      if (err) res.json({ error: err });
      let isValid = false;
      if (user.tokens.includes(decoded.jti)) isValid = true;
      res.json({ id: decoded.id,
                 email: decoded.email,
                 expiration: new Date(decoded.exp * 1000),
                 isValid: isValid });
    });
  } catch (err) {
    res.json({ error: err});
  }
};

exports.confirm = confirm;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.checkauth = checkauth;
