const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

const User = require('../models/user');
const mailer = require('../helpers/mailer');

//TODO: move to config file
const jwtsecret = 'mysecret';

const confirm = async function (req, res) {
  const email = req.params.email;

  const query = User.updateOne({ email: email }, {$set : { activated: true }});
  await query.exec();
  res.json({ message: `${email} was activated!` });
};

const signup = async function (req, res) {
  //TODO: add body validation
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);

  User.create(user);

  //TODO: move to separate module
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

const login = async function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) res.status(401).json({ status: 'Unauthorized' });

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
  })(req, res, next);
};

const logout = async function (req, res, next) {
  const token = req.get('auth');
  const decoded = jwt.verify(token, jwtsecret);
  const user = await User.findOne({ email: decoded.email });
  const indexOfToken = user.tokens.indexOf(decoded.jti);
  const tokens = user.tokens.slice(0, indexOfToken).concat(user.tokens.slice(indexOfToken+1));
  user.tokens = tokens;

  //TODO: fix it
  // const query = User.updateOne({ email: user.email });
  // await query.exec();
  // res.json({ message: 'Token invalid. User logged out successfully.' });

  User.updateOne({ email: user.email }, user, function (err) {
    if (err) res.json({ error: err });
    res.json({ message: 'Token invalid. User logged out successfully.' });
  });
};

const checkauth = async function(req, res) {
  try {
    //TODO: apply destructurization
    const decoded = jwt.verify(req.get('auth'), jwtsecret);
    const user = await User.findOne({ email: decoded.email });
    let isValid = false;
    if (user.tokens.includes(decoded.jti)) isValid = true;
    res.json({
      id: decoded.id,
      email: decoded.email,
      expiration: new Date(decoded.exp * 1000),
      isValid: isValid
    });
  } catch (err) {
    res.json({ error: err});
  }
};

const recovery = async function(req, res) {
  const token = uniqid();

  //TODO: move to separate module
  const email = {
    from: 'zndtestdev@gmail.com',
    to: req.body.email,
    subject: 'Auction Marketplace: password recovering!',
    html: `<p>To confirm recovering follow the link: <a href="http://localhost:3001/api/user/changepass/${token}">confirmation</a></p>`
  };

  const query = User.updateOne({ email: req.body.email }, {$set : { changePassToken: token }});
  await query.exec();

  mailer.send(email);
  res.json({
    message: 'Recovering email was sent.',
    token: token
  });
};

const changepass = async function(req, res) {
  const email = req.body.email;
  const token = req.body.token;

  //TODO: move round times to the config file
  const password = await bcrypt.hash(req.body.password, 10);
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
