const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const passport = require('passport');
const controller = require('../controllers/users.js');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/confirm/:email', controller.confirm);
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/user', passport.authenticate('jwt', { session: false }), controller.user);

module.exports = router;
