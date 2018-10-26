const router = require('express').Router();
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validators');
const controller = require('../controllers/users.js');

router.get('/confirm/:email', controller.confirm);

router.get('/checkauth', controller.checkauth);

router.post('/signup', validators.forUser, controller.signup);

router.post('/login', auth.authenticate('local', { session: false }), controller.login);

router.post('/logout', auth.authenticate('jwt', { session: false }), controller.logout);

router.post('/recovery', controller.recovery);

router.post('/change/password', validators.forUserPassword, controller.changepass);

module.exports = router;
