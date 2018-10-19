const express = require('express');

const db = require('./models/db');
const User = require('./models/user');

const userRoutes = require('./routes/user.js');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtsecret = 'mysecret';

const app = express();

const close = (err, onclose) => {
  if (onclose) onclose();
  if (err) console.log(err.message);
  db.connection.close();
  process.exit();
};

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) return done(null, false);
      if (!user.activated) return done(null, false);
      if (!bcrypt.compareSync(password, user.password)) return done(null, false);
      return done(null, user);
    });
  }
));


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('auth'),
  secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    User.findOne({ email: payload.email }, (err, user) => {
      if (err) return done(err);
      if (user && user.tokens.includes(payload.jti)) done(null, user);
      else done(null, false);
    });
  })
);

app.use(passport.initialize());

app.get('/api/healthcheck', function (req, res) {
  res.status(200);
  res.json({ status: 'OK' });
});

app.use('/api/user', userRoutes);

app.listen(3001, function () {
  console.log('Auction app listening on port 3001!');
});

process.on('SIGINT', function() {
  close(null, () => {
    console.log('Process was interupted!');
  });
});
