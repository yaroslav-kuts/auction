const express = require('express');
const bodyParser = require("body-parser");
const db = require('./models/db');
const users = require('./models/users');
const mailer = require('./helpers/mailer');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy; // Auth via JWT
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
    users.findOne(username, function (err, user) {
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
    console.log(payload.email);
    users.findOne(payload.email, (err, user) => {
      if (err) {
        return done(err)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get('/api/healthcheck', function (req, res) {
  res.status(200);
  res.json({ status: 'OK' });
});

app.get('/api/confirm/:email', function (req, res) {
  const email = req.params.email;
  users.activateUser(email, (err, email) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json({ message: 'Error during user account confirmation!' });
    }
    res.status(200);
    res.json({ message: `${email} was activated!` });
  });
});

app.post('/api/signup', function (req, res) {
  //TODO: add body validation
  users.create(req.body);

  const email = {
    from: `zndtestdev@gmail.com`,
    to: req.body.email,
    subject: `Auction Marketplace: Signup confirmation!`,
    html: `<p>To confirm registration follow the link: <a href="http://localhost:3001/api/confirm/${req.body.email}">confirmation</a></p>`
  };

  mailer.send(email);
  res.status(200);
  res.json(req.body);
});


app.post('/api/login', function(req, res, next) {
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
      const token = jwt.sign(payload, jwtsecret);
      res.json({ user: user.email, token: `JWT ${token}`});
    }
  })(req, res, next);
});

app.post('/api/user', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.json({ user: "test" });
    }
);

app.listen(3001, function () {
  console.log('Auction app listening on port 3001!');
});

process.on('SIGINT', function() {
  close(null, () => {
    console.log('\nProcess was interupted!');
  });
});
