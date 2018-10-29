const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/orders.js');

router.use(auth.authenticate('jwt', { session: false }));

router.post('/create', controller.create);

router.post('/update', controller.update);

router.delete('/delete/:id', controller.remove);

router.get('/:id', controller.get);

module.exports = router;