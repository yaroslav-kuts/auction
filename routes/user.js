const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const controller = require('../controllers/users.js');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/confirm/:email', controller.confirm);
router.get('/checkauth', controller.checkauth);
router.post('/signup', controller.signup);
router.post('/login', controller.login);

module.exports = router;
