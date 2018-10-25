require('../../app');
const assert = require('chai').assert;
const supertest = require('supertest');
const config = require('../../config/config');
const Lot = require('../../models/lot');
const User = require('../../models/user');
const db = require('../../db');
const token = require('../helpers/credentials');

const server = supertest.agent(`http://localhost:${config.port}`);

describe('/api/bids', function () {

  const lotId = '5bd088b12a5fa821f2577c9f';

  const bid = {
    price: 550,
    createdAt: '2018-10-16T09:31:44.992Z'
  };

  let jwt;

  let user = {
    _id: '5bd07ad32a10b81895dc5390',
    email: 'testing@mail.com',
    password: '$2b$10$I022dlia4ZW6KdSLRHxT3.TBNxanfHzgIL1xy.jQQdFoGR3g31RBG',
    phone: '+1-541-774-9176',
    firstName: 'John',
    lastName: 'Dou',
    birthday: '1990-10-16T09:31:44.992Z',
    activated: true,
    tokens: []
  };

  let lot = {
    title: 'TestProduct',
    description: 'Simple test product.',
    status: 'inProgress',
    createdAt: '2018-08-16T09:31:44.992Z',
    currentPrice: 100,
    estimatedPrice: 300,
    startTime: '2018-09-16T09:31:44.992Z',
    endTime: '2018-11-16T09:31:44.992Z',
    order: {}
  };

  before(async function() {
    user = await User.create(user);
    jwt = await token(user.email, 'password');
    lot.user = user._id;
    lot = await Lot.create(lot);
    bid.user = user._id;
    bid.lot = lotId;
  });

  after(function () {
    db.clean();
  });

  describe('POST /api/bids/create', function() {
    it('should return status 200 OK', function(done) {
      server
      .post('/api/bids/create')
      .set({ Authorization: jwt })
      .send(bid)
      .expect(200)
      .end(function(err, res) {
        const actual = res.body;
        assert.equal(actual.createdAt, bid.createdAt);
        assert.equal(actual.price, bid.price);
        assert.equal(actual.lot.toString(), bid.lot);
        assert.equal(actual.user.toString(), bid.user);
        done();
      });
    });
  });

  describe('POST /api/bids/create', function() {
    it('should return status 401 Unauthorized for invalid token', function(done) {
      server
      .post('/api/bids/create')
      .set({ Authorization: 'invalid' })
      .send(bid)
      .expect(401, done);
    });
  });

  describe('POST', function() {
    it('should return status 422 Unprocessable Entity for bid with non-numeric price', function(done) {
      bid.price = 'invalid';
      server
      .post('/api/bids/create')
      .set({ Authorization: jwt })
      .send(bid)
      .expect(422, done);
    });
  });

  describe('POST /api/bids/create', function() {
    it('should return status 405 Method Not Allowed if user create bid for own lot', function(done) {
      bid.lot = lot._id;
      bid.price = 67;
      server
      .post('/api/bids/create')
      .set({ Authorization: jwt })
      .send(bid)
      .expect(405, done);
    });
  });

  describe('GET /api/bids/get', function() {
    it('should return status 200 OK', function(done) {
      server
      .get(`/api/bids/get?lot=${lotId}`)
      .set({ Authorization: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.isTrue(res.body.bids.length > 0);
        done();
      });
    });
  });

  describe('GET /api/bids/get', function() {
    it('should return status 401 Unauthorized for invalid token', function(done) {
      server
      .get(`/api/bids/get?lot=${lotId}`)
      .set({ Authorization: 'invalid' })
      .expect(401, done);
    });
  });

});
