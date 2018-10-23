const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/lots.js');
// const { body, check } = require('express-validator/check');

router.post('/create', auth.authenticate('jwt', { session: false }), controller.create);

router.get('/my', auth.authenticate('jwt', { session: false }), controller.myLots);

router.get('/all', auth.authenticate('jwt', { session: false }), controller.allLots);

router.post('/update', auth.authenticate('jwt', { session: false }), controller.update);

router.post('/delete', auth.authenticate('jwt', { session: false }), controller.remove);

module.exports = router;
