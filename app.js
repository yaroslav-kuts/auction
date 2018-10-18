const express = require('express');
const bodyParser = require("body-parser");
const db = require('./models/db');
const users = require('./models/users');
const mailer = require('./helpers/mailer');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

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

app.post('/api/login',
  passport.authenticate('local', { session: false }),
  function(req, res) {
    res.json({ authenticated: 'true'});
  });

app.listen(3001, function () {
  console.log('Auction app listening on port 3001!');
});

process.on('SIGINT', function() {
  close(null, () => {
    console.log('\nProcess was interupted!');
  });
});
