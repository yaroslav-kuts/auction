const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

const User = require('../models/user');
const mailer = require('../helpers/mailer');

const jwtsecret = 'mysecret';

const confirm = function (req, res) {
  const email = req.params.email;
  User.updateOne({ email: email }, {$set : { activated: true }}, function (err) {
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

  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);

  User.create(user, function(err, doc) {
    if (err) {
      res.status(500);
      res.json({ error: err });
    }
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
      const payload = {
        id: user._id,
        email: user.email,
        jti: jti
      };
      const token = jwt.sign(payload, jwtsecret, { expiresIn: '2h' });
      user.tokens.push(jti);
      User.updateOne({ email: user.email }, user, function (err) {
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
    User.updateOne({ email: user.email }, user, function (err) {
      if (err) res.json({ error: err });
      res.json({ message: 'Token invalid. User logged out successfully.' });
    });
  });
};

const checkauth = function(req, res) {
  try {
    var decoded = jwt.verify(req.get('auth'), jwtsecret);
    User.findOne({ email: decoded.email }, (err, user) => {
      //TODO: add appropriative status when return error
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

const recovery = function(req, res) {
  const token = uniqid();

  const email = {
    from: 'zndtestdev@gmail.com',
    to: req.body.email,
    subject: 'Auction Marketplace: password recovering!',
    html: `<p>To confirm recovering follow the link: <a href="http://localhost:3001/api/user/changepass/${token}">confirmation</a></p>`
  };

  User.updateOne({ email: req.body.email }, {$set : { changePassToken: token }}, function (err) {
    if (err) res.json({ error: err });
    mailer.send(email);
    res.status(200);
    res.json({ message: 'Recovering email was sent.',
               token: token });
  });
};

const changepass = function(req, res) {
  const email = req.body.email;
  const token = req.body.token;
  let password = req.body.password;
  password = bcrypt.hashSync(password, 10);

  User.findOne({ email: email }, function (err, user) {
    if (err) res.json({ error: err });
    else if (!user) res.json({ error: 'There is no such user.' });
    else if (user.changePassToken !== token) res.json({ error: 'Not valid token for changing password.' });
    else {
      User.updateOne({ email: email }, {$set : { password: password }}, function (err) {
        if (err) res.json({ error: err });
        res.json({ message: 'Password was changed.'});
      });
    }
  });
};

exports.confirm = confirm;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.checkauth = checkauth;
exports.recovery = recovery;
exports.changepass = changepass;
