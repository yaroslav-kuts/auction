const { body, check } = require('express-validator/check');
const moment = require('moment');

const forUser = [
  check('email').isEmail(),
  check('phone').isMobilePhone('en-US'),
  check('password').isLength({ min: 4 }),
  body('birthday').custom(value => {
    if (moment().diff(new Date(value), 'years') < 21) return Promise.reject('Age must be 21+.');
    return Promise.resolve();
  })
];

const forLot = [ check('user').isMongoId() ];

module.exports = {
  forUser,
  forLot
};
