const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const User = require('../models/user');
const mailer = require('../helpers/mailer');
const config = require('../config/config');
const templates = require('../helpers/templates');

const confirm = async function (req, res) {
  const email = req.params.email;
  const query = User.updateOne({ email: email }, {$set : { activated: true }});
  await query.exec();
  res.json({ message: `${email} was activated.` });
};

const signup = async function (req, res) {
  //TODO: add body validation
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, config.saltRounds);
  User.create(user);
  mailer.send(templates.signup(user.email));
  res.json(user);
};

const login = async function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) res.status(401).json({ status: 'Unauthorized' });

    const jti = uniqid();
    const payload = {
      id: user._id,
      email: user.email,
      jti: jti
    };
    const token = jwt.sign(payload, config.jwtsecret, { expiresIn: config.expiresIn });
    user.tokens.push(jti);
    User.updateOne({ email: user.email }, user, function (err) {
      if (err) res.json({ error: err });
      res.json({ user: user.email, token: `JWT ${token}`});
    });
  })(req, res, next);
};

const logout = async function (req, res, next) {
  const token = req.get('auth');
  const decoded = jwt.verify(token, config.jwtsecret);
  const user = await User.findOne({ email: decoded.email });
  const indexOfToken = user.tokens.indexOf(decoded.jti);
  user.tokens = user.tokens.slice(0, indexOfToken).concat(user.tokens.slice(indexOfToken+1));
  User.updateOne({ email: user.email }, user, function (err) {
    if (err) res.json({ error: err });
    res.json({ message: 'Token invalid. User logged out successfully.' });
  });
};

const checkauth = async function(req, res) {
  const decoded = jwt.verify(req.get('auth'), config.jwtsecret);
  const user = await User.findOne({ email: decoded.email });
  let isValid = false;
  if (user.tokens.includes(decoded.jti)) isValid = true;
  res.json({
    id: decoded.id,
    email: decoded.email,
    expiration: new Date(decoded.exp * 1000),
    isValid: isValid
  });
};

const recovery = async function(req, res) {
  const token = uniqid();
  const query = User.updateOne({ email: req.body.email }, {$set : { changePassToken: token }});
  await query.exec();
  mailer.send(templates.recovery(req.body.email, token));
  res.json({
    message: 'Recovering email was sent.',
    token: token
  });
};

const changepass = async function(req, res) {
  const { email, token } = req.body;
  const password = await bcrypt.hash(req.body.password, config.saltRounds);
  const user = await User.findOne({ email: email });

  if (!user) return res.json({ error: 'There is no such user.' });
  if (user.changePassToken !== token) return res.json({ error: 'Not valid token for changing password.' });

  const query = User.updateOne({ email: email }, {$set : { password: password }});
  await query.exec();
  res.json({ message: 'Password was changed.'});
};

module.exports = {
  confirm,
  signup,
  login,
  logout,
  checkauth,
  recovery,
  changepass
};
