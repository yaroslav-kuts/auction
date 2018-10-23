const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/config');

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
  secretOrKey: config.jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    User.findOne({ email: payload.email }, (err, user) => {
      if (err) return done(err);
      if (user && user.tokens.includes(payload.jti)) return done(null, user);
      return done(null, false);
    });
  })
);

module.exports = passport;
