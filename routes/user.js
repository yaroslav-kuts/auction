const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const passport = require('passport');
const controller = require('../controllers/users.js');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/confirm/:email', controller.confirm);
router.get('/checkauth', controller.checkauth);
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/logout', passport.authenticate('jwt', { session: false }), controller.logout);
router.post('/recovery', controller.recovery);
router.post('/change/password', controller.changepass);

module.exports = router;
