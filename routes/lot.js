const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/lots.js');
const validators = require('../middlewares/validators');

router.use(auth.authenticate('jwt', { session: false }));

router.post('/create', validators.forLot, controller.create);

router.get('/my', controller.myLots);

router.get('/all', controller.allLots);

router.post('/update', controller.update);

router.post('/delete', controller.remove);

module.exports = router;
