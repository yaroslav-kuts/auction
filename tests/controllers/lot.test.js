require('../../app');
const assert = require('chai').assert;
const supertest = require('supertest');
const { readFileSync } = require('fs');
const Lot = require('../../models/lot');
const User = require('../../models/user');

const image = './tests/resources/test.jpg';

const server = supertest.agent('http://localhost:3000');

let user = {
  email: 'testing@mail.com',
  password: 'testing',
  phone: '+1-541-774-9176',
  firstName: 'John',
  lastName: 'Dou',
  birthday: '1990-10-16T09:31:44.992Z',
  activated: true,
  tokens: ['dxldgrjnlr6zzw']
};

const jwt = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViY2YxZjE3YWU1NjQ4NDQyYmFhZTE4NiIsImVtYWlsIjoieWFyb3NsYXZrdXRzQGdtYWlsLmNvbSIsImp0aSI6ImR4bGRncmpubHI2enp3IiwiaWF0IjoxNTQwMzAwNTc3LCJleHAiOjE1NDAzMDc3Nzd9.xwrHv9lg_knC3mcuRYLqwmLBMYEcle5FA4rIIO_3uVM';

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

describe('/api/lots', function() {

  before(async function() {
    Lot.user = await User.create(user)._id;
  });

  after(function() {
    Lot.deleteMany({}, function(err) {
      if (err) console.log(err);
    });
  });

  describe('POST /api/lots/create', function() {
    it('should return status 200 OK', function(done) {
      server
      .post('/api/lots/create')
      .set({ Authorization: jwt })
      .send(lot)
      .expect(200)
      .end(function(err, res) {
        done();
      });
    });
  });

  describe('POST /api/lots/create', function() {
    lot.image = new Buffer(readFileSync(image)).toString('base64');
    it('should return status 200 OK for json with image', function(done) {
      server
      .post('/api/lots/create')
      .set({ Authorization: jwt })
      .send(lot)
      .expect(200)
      .end(function(err, res) {
        done();
      });
    });
  });

  describe('POST /api/lots/update', function() {
    it('should return status 200 OK', function(done) {
      lot.description = 'changed description';
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

  describe('POST /api/lots/my', function() {
    it('should return status 200 OK', function(done) {
      Lot.create(lot, function (err, doc) {
        if (err) console.log(err);
        server
        .post('/api/lots/my')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(200)
        .end(function(err, res) {
          done();
        });
      });
    });
  });

  describe('POST /api/lots/all', function() {
    it('should return status 200 OK', function(done) {
      Lot.create(lot, function (err, doc) {
        if (err) console.log(err);
        server
        .post('/api/lots/all')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(200)
        .end(function(err, res) {
          done();
        });
      });
    });
  });

  describe('POST /api/lots/delete', function() {
    it('should return status 200 OK', function(done) {
      Lot.create(lot, function (err, doc) {
        if (err) console.log(err);
        server
        .post('/api/lots/delete')
        .set({ Authorization: jwt })
        .send({ _id: doc._id })
        .expect(200)
        .end(function(err, res) {
          done();
        });
      });
    });
  });

});
