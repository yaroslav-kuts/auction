const { body, check, validationResult } = require('express-validator/check');
const moment = require('moment');

const sendErrorIfExists = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

const forUser = [
  check('email').isEmail(),
  check('phone').isMobilePhone('en-US'),
  check('password').isLength({ min: 4 }),
  body('birthday').custom(value => {
    if (moment().diff(new Date(value), 'years') < 21) return Promise.reject('Age must be 21+.');
    return Promise.resolve();
  }),
];

const forLot = [
  check('user').isMongoId(),
  sendErrorIfExists
];

const forBid = [
  body('price').custom(async (value) => {
    const isValid = /^[0-9]+((\.)[0-9]{1,2})?$/.test(value);
    if (isValid === false) throw new Error('Not valid price');
  }),
  sendErrorIfExists
];

module.exports = {
  forUser,
  forLot,
  forBid
};
