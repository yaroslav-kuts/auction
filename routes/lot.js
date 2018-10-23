const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/lots.js');
// const { body, check } = require('express-validator/check');

router.post('/create', auth.authenticate('jwt', { session: false }), controller.create);

module.exports = router;
