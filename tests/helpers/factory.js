const factory = require('factory-girl').factory;
const User = require('../../models/user');
const Lot = require('../../models/lot');
const Bid = require('../../models/bid');

factory.define('user', User, {
  email: factory.seq('User.email', (n) => `user${n}@mail.com`),
  password: '$2b$10$I022dlia4ZW6KdSLRHxT3.TBNxanfHzgIL1xy.jQQdFoGR3g31RBG',
  phone: factory.seq('User.phone', (n) => `+1-541-774-917${n}`),
  firstName: 'John',
  lastName: 'Dou',
  birthday: '1990-10-16T09:31:44.992Z',
  activated: true,
  tokens: []
});

factory.define('lot', Lot, {
  title: 'TestProduct',
  user: '5bceee647f131227684abb73',
  description: 'Simple test product.',
  status: 'inProgress',
  createdAt: '2018-10-16T09:31:44.992Z',
  currentPrice: 100,
  estimatedPrice: 300,
  startTime: '2018-11-16',
  endTime: '2019-01-16',
  order: {}
});

factory.define('bid', Bid, {
  price: 550
});

module.exports = factory;
