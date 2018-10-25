const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/bids.js');
const validators = require('../middlewares/validators');

router.use(auth.authenticate('jwt', { session: false }));

router.post('/create', validators.forBid, controller.create);

router.get('/get', controller.get);

module.exports = router;
