const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/users.js');
// const date = require('../helpers/date.js');
const moment = require('moment');
const { body, check } = require('express-validator/check');

router.get('/confirm/:email', controller.confirm);

router.get('/checkauth', controller.checkauth);

router.post('/signup', [
  check('email').isEmail(),
  check('phone').isMobilePhone('en-US'),
  check('password').isLength({ min: 4 }),
  body('birthday').custom(value => {
    if (moment().diff(new Date(value), 'years') < 21) return Promise.reject('Age must be 21+.');
    return Promise.resolve();
  })
], controller.signup);

router.post('/login', auth.authenticate('local', { session: false }), controller.login);

router.post('/logout', auth.authenticate('jwt', { session: false }), controller.logout);

router.post('/recovery', controller.recovery);

router.post('/change/password', controller.changepass);

module.exports = router;
