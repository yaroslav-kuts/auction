const { body, check, validationResult } = require('express-validator/check');
const moment = require('moment');

const sendErrorIfExists = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

const email = check('email').isEmail();
const phone = check('phone').isMobilePhone('en-US');
const password = check('password').isLength({ min: 4 });
const age =   body('birthday').custom(async (value) => {
  if (moment().diff(new Date(value), 'years') < 21) throw new Error('Age must be 21+.');
});
const id = (field) => check(field).isMongoId();
const price = (field) => check(field).matches(/^[0-9]+((\.)[0-9]{1,2})?$/);
const start = check('startTime').isAfter();
const end =   body(['endTime']).custom(async ( endTime, { req }) => {
  const isValid = (new Date(req.body.startTime ) < new Date(endTime));
  if (!isValid) throw new Error('Start time must be less than end time.');
});

module.exports = {
  forUser: [email, phone, password, age, sendErrorIfExists],
  forUserPassword: [password, sendErrorIfExists],
  forLot: [id('user'), price('currentPrice'), price('estimatedPrice'), start, end, sendErrorIfExists],
  forLotUpdate: [price('currentPrice'), sendErrorIfExists],
  forBid: [price('price'), sendErrorIfExists]
};
