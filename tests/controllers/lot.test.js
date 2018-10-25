require('../../app');
const assert = require('chai').assert;
const supertest = require('supertest');
const { readFileSync } = require('fs');
const config = require('../../config/config');
const db = require('../../db');
const token = require('../helpers/credentials');
const Lot = require('../../models/lot');
const User = require('../../models/user');

const server = supertest.agent(`http://localhost:${config.port}`);

describe('/api/lots', function() {

  const image = './tests/resources/test.jpg';

  let jwt;

  let user = {
    email: 'testing@mail.com',
    password: '$2b$10$I022dlia4ZW6KdSLRHxT3.TBNxanfHzgIL1xy.jQQdFoGR3g31RBG',
    phone: '+1-541-774-9176',
    firstName: 'John',
    lastName: 'Dou',
    birthday: '1990-10-16T09:31:44.992Z',
    activated: true,
    tokens: ['dxldgrjnlr6zzw']
  };

  const lot = {
    title: 'TestProduct',
    user: '5bceee647f131227684abb73',
    description: 'Simple test product.',
    status: 'inProgress',
    createdAt: '2018-10-16T09:31:44.992Z',
    currentPrice: 100,
    estimatedPrice: 300,
    startTime: '2018-10-16T09:31:44.992Z',
    endTime: '2018-10-16T09:31:44.992Z',
    order: {}
  };

  before(async function() {
    user = await User.create(user);
    lot.user = user._id;
    jwt = await token(user.email, 'password');
  });

  after(function() {
    db.clean();
  });

  describe('POST /api/lots/create', function() {
    it('should return status 200 OK', function(done) {
      server
      .post('/api/lots/create')
      .set({ Authorization: jwt })
      .send(lot)
      .expect(200)
      .end(function(err, res) {
        const actual = res.body;
        assert.equal(actual.title, lot.title);
        assert.equal(actual.user, lot.user);
        assert.equal(actual.description, lot.description);
        assert.equal(actual.currentPrice, lot.currentPrice);
        assert.equal(actual.estimatedPrice, lot.estimatedPrice);
        done();
      });
    });
  });

  describe('POST /api/lots/create', function() {
    lot.image = new Buffer(readFileSync(image)).toString('base64');
    it('should return status 401 Unauthorized for invalid token', function(done) {
      server
      .post('/api/lots/create')
      .set({ Authorization: 'invalid' })
      .send(lot)
      .expect(401, done)
    });
  });

  describe('POST /api/lots/create', function() {
    it('should return status 200 OK for json with image', function(done) {
      lot.image = new Buffer(readFileSync(image)).toString('base64');
      server
      .post('/api/lots/create')
      .set({ Authorization: jwt })
      .send(lot)
      .expect(200)
      .end(function(err, res) {
        const path = `./images/${res.body._id}/image.jpg`;
        const actualImage = new Buffer(readFileSync(path)).toString('base64');
        assert.isTrue(actualImage === lot.image);
        done();
      });
    });
  });

  describe('POST /api/lots/update', function() {
    it('should return status 200 OK', function(done) {
      lot.description = 'changed description';
      lot.image = '';
      Lot.create(lot, function (err, doc) {
        if (err) console.log(err);
        server
        .post('/api/lots/update')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(200)
        .end(function(err, res) {
          Lot.findById(doc._id, function(err, finded) {
            assert.equal(finded.description, lot.description);
            done();
          });
        });
      });
    });
  });

  describe('POST /api/lots/update', function() {
    it('should return status 401 Unauthorized for invalid token', function(done) {
      lot.description = 'changed description';
      Lot.create(lot, function (err, doc) {
        if (err) console.log(err);
        server
        .post('/api/lots/update')
        .set({ Authorization: 'invalid' })
        .send(lot)
        .expect(401, done);
      });
    });
  });

  describe('POST /api/lots/my', function() {
    it('should return status 200 OK', function(done) {
      const page = 1;
      const limit = 2;
      server
      .get(`/api/lots/my?page=${page}&limit=${limit}`)
      .set({ Authorization: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.isTrue(res.body.lots.length === limit);
        done();
      });
    });
  });

  describe('POST /api/lots/my', function() {
    it('should return status 200 OK without GET parameters', function(done) {
      server
      .get('/api/lots/my')
      .set({ Authorization: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.isTrue(res.body.lots.length > 0);
        done();
      });
    });
  });

  describe('POST /api/lots/my', function() {
    it('should return status 401 Unauthorized for invalid token', function(done) {
      server
      .get('/api/lots/my')
      .set({ Authorization: 'invalid' })
      .expect(401, done);
    });
  });

  describe('POST /api/lots/all', function() {
    const page = 1;
    const limit = 2;
    it('should return status 200 OK', function(done) {
      server
      .get(`/api/lots/all?page=${page}&limit=${limit}`)
      .set({ Authorization: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.isTrue(res.body.lots.docs.length === limit);
        done();
      });
    });
  });

  describe('POST /api/lots/all', function() {
    it('should return status 200 OK without GET parameters', function(done) {
      server
      .get('/api/lots/all')
      .set({ Authorization: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.isTrue(res.body.lots.docs.length > 0);
        done();
      });
    });
  });

  describe('POST /api/lots/all', function() {
    it('should return status 401 Unauthorized for invalid token', function(done) {
      server
      .get('/api/lots/all')
      .set({ Authorization: 'invalid' })
      .expect(401, done);
    });
  });

  describe('POST /api/lots/delete', function() {
    it('should return status 200 OK', function(done) {
      Lot.create(lot, function (err, doc) {
        server
        .post('/api/lots/delete')
        .set({ Authorization: jwt })
        .send({ _id: doc._id })
        .expect(200)
        .end(function() {
          Lot.findById(doc._id, function (err, actual) {
            assert.isTrue(!actual);
            done();
          });
        });
      });
    });
  });

  describe('POST /api/lots/delete', function() {
    it('should return status 401 Unauthorized for invalid token', function(done) {
      Lot.create(lot, function (err, doc) {
        server
        .post('/api/lots/delete')
        .set({ Authorization: 'invalid' })
        .send({ _id: doc._id })
        .expect(401, done);
      });
    });
  });

});
