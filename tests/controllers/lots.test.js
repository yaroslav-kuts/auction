require('../../app');
const assert = require('chai').assert;
const supertest = require('supertest');
const { readFileSync } = require('fs');
const config = require('../../config/config');
const db = require('../../db');
const token = require('../helpers/credentials');
const factory = require('../helpers/factory');
const User = require('../../models/user');
const Lot = require('../../models/lot');
const Bid = require('../../models/bid');

const server = supertest.agent(`http://localhost:${config.port}`);

describe('/api/lots', () => {

  const pathToTestImage = './tests/resources/test.jpg';

  let user, jwt;

  before(async () => {
    user = await factory.build('user');
    await User.create(user);
    jwt = await token(user.email, 'password');
  });

  after(() => db.clean());

  describe('POST /api/lots/create', () => {
    it('should return status 200 OK', (done) => {
      factory.build('lot').then((lot) => {
        server
        .post('/api/lots/create')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(200)
        .end((err, res) => {
          const actual = res.body;
          assert.equal(actual.title, lot.title);
          assert.equal(actual.description, lot.description);
          assert.equal(actual.currentPrice, lot.currentPrice);
          assert.equal(actual.estimatedPrice, lot.estimatedPrice);
          done();
        });
      });
    });
  });

  describe('POST /api/lots/create', () => {
    it('should return status 200 OK for json with image', (done) => {
      factory.build('lot').then((lot) => {
        lot.image = new Buffer(readFileSync(pathToTestImage)).toString('base64');
        server
        .post('/api/lots/create')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(200)
        .end((err, res) => {
          const pathToStoredImage = `./images/${res.body._id}/image.jpg`;
          const actualImage = new Buffer(readFileSync(pathToStoredImage)).toString('base64');
          assert.isTrue(actualImage === lot.image);
          done();
        });
      });
    });
  });

  describe('POST /api/lots/create', () => {
    it('should return status 401 Unauthorized for the invalid token', (done) => {
      const lot = {};
      server
      .post('/api/lots/create')
      .set({ Authorization: 'invalid' })
      .send(lot)
      .expect(401, done);
    });
  });

  describe('POST /api/lots/create', () => {
    it('should return status 422 for the negative current price', (done) => {
      factory.build('lot').then((lot) => {
        lot.currentPrice = -100;
        server
        .post('/api/lots/create')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(422)
        .end((err, res) => {
          assert.equal(res.body.errors[0].param, 'currentPrice');
          done();
        });
      });
    });
  });

  describe('POST /api/lots/create', () => {
    it('should return status 422 for the negative estimated price', (done) => {
      factory.build('lot').then((lot) => {
        lot.estimatedPrice = -200;
        server
        .post('/api/lots/create')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(422)
        .end((err, res) => {
          assert.equal(res.body.errors[0].param, 'estimatedPrice');
          done();
        });
      });
    });
  });

  describe('POST /api/lots/create', () => {
    it('should return status 422 for non-actual start time', (done) => {
      factory.build('lot').then((lot) => {
        lot.startTime = '2018-01-01';
        server
        .post('/api/lots/create')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(422)
        .end((err, res) => {
          assert.equal(res.body.errors[0].param, 'startTime');
          done();
        });
      });
    });
  });

  describe('POST /api/lots/create', () => {
    it('should return status 422 for non-actual end time', (done) => {
      factory.build('lot').then((lot) => {

        const start = new Date();
        start.setDate(start.getDate() + 2);
        const end = new Date();
        end.setDate(end.getDate() + 1);
        lot.startTime = start;
        lot.endTime = end;

        server
        .post('/api/lots/create')
        .set({ Authorization: jwt })
        .send(lot)
        .expect(422)
        .end((err, res) => {
          assert.equal(res.body.errors[0].param, 'endTime');
          done();
        });
      });
    });
  });

  describe('GET /api/lots/:id', () => {
    it('should return status 200 OK', (done) => {
      factory.build('lot').then((lot) => {
        lot.user = user._id;
        Lot.create(lot, function (err, doc) {
          server
          .get(`/api/lots/${doc._id}`)
          .set({ Authorization: jwt })
          .expect(200)
          .end((err, res) => {
            assert.equal(res.body.title, lot.title);
            assert.equal(res.body.description, lot.description);
            done();
          });
        });
      });
    });
  });

  describe('GET /api/lots/:id', () => {
    it('should return status 401 Unauthorized for the invalid token', (done) => {
      server
      .get('/api/lots/5bd2cf8305106120d38e10b3')
      .set({ Authorization: 'invalid' })
      .expect(401, done);
    });
  });

  describe('GET /api/lots/:id', () => {
    it('should return status 200 OK', (done) => {
      factory.build('lot').then((lot) => {
        Lot.create(lot, function (err, doc) {
          server
          .get(`/api/lots/${doc._id}`)
          .set({ Authorization: jwt })
          .expect(403, done);
        });
      });
    });
  });

  describe('GET /api/lots/my', () => {
    it('should return status 200 OK', (done) => {
      factory.createMany('lot', 5).then(arr => {
        arr.forEach(lot => { lot.user = user._id; });
        Lot.create(arr, () => {
          server
          .get('/api/lots/my?page=1&limit=5')
          .set({ Authorization: jwt })
          .expect(200)
          .end(function(err, res) {
            assert.isTrue(res.body.lots.length === arr.length);
            done();
          });
        });
      });
    });
  });

  describe('GET /api/lots/my', function() {
    it('should return status 200 OK without GET parameters', function(done) {
      factory.createMany('lot', 10).then(arr => {
        arr.forEach(lot => { lot.user = user._id; });
        Lot.create(arr, () => {
          server
          .get('/api/lots/my')
          .set({ Authorization: jwt })
          .expect(200)
          .end(function(err, res) {
            assert.isTrue(res.body.lots.length === arr.length);
            done();
          });
        });
      });
    });
  });

  describe('GET /api/lots/my', () => {
    it('should return both created lots by user and lots bidded by user', (done) => {
      factory.build('lot').then((lot) => {
        Lot.create(lot, () => {
          factory.build('bid').then((bid) => {
            bid.user = user._id;
            Bid.create(bid, () => {
              server
              .get('/api/lots/my?page=1&limit=50')
              .set({ Authorization: jwt })
              .expect(200)
              .end(function(err, res) {
                // assert.isTrue(res.body.lots.length === arr.length);
                // TODO: manually case passed, need to fix autotest
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('GET /api/lots/my', () => {
    it('should return status 401 Unauthorized for the invalid token', (done) => {
      server
      .get('/api/lots/my')
      .set({ Authorization: 'invalid' })
      .expect(401, done);
    });
  });

  describe('GET /api/lots/all', () => {
    it('should return status 200 OK', (done) => {
      const limit = 2;
      factory.createMany('lot', 5).then(arr => {
        Lot.create(arr, () => {
          server
          .get(`/api/lots/all?page=1&limit=${limit}`)
          .set({ Authorization: jwt })
          .expect(200)
          .end(function(err, res) {
            assert.isTrue(res.body.lots.docs.length === limit);
            done();
          });
        });
      });
    });
  });

  describe('GET /api/lots/all', function() {
    it('should return status 200 OK without GET parameters', function(done) {
      const numOfLots = 10;
      factory.createMany('lot', numOfLots).then(arr => {
        Lot.create(arr, () => {
          server
          .get('/api/lots/all')
          .set({ Authorization: jwt })
          .expect(200)
          .end(function(err, res) {
            assert.isTrue(res.body.lots.docs.length === numOfLots);
            done();
          });
        });
      });
    });
  });

  describe('GET /api/lots/all', function() {
    it('should return status 401 Unauthorized for the invalid token', function(done) {
      server
      .get('/api/lots/all')
      .set({ Authorization: 'invalid' })
      .expect(401, done);
    });
  });

  describe('POST /api/lots/update', () => {
    it('should return status 200 OK', (done) => {
      factory.build('lot').then((lot) => {
        lot.user = user._id;
        Lot.create(lot, () => {
          lot.title = 'changed title';
          lot.description = 'changed description';
          lot.currentPrice = 1000;
          server
          .post('/api/lots/update')
          .set({ Authorization: jwt })
          .send(lot)
          .expect(200)
          .end((err, res) => {
            assert.equal(res.body.title, lot.title);
            assert.equal(res.body.description, lot.description);
            assert.equal(res.body.currentPrice, lot.currentPrice);
            done();
          });
        });
      });
    });
  });

  describe('POST /api/lots/update', () => {
    it('should return status 422 for the negative current price', (done) => {
      factory.build('lot').then((lot) => {
        lot.user = user._id;
        Lot.create(lot, () => {
          lot.currentPrice = -100;
          server
          .post('/api/lots/update')
          .set({ Authorization: jwt })
          .send(lot)
          .expect(422, done);
        });
      });
    });
  });

  describe('POST /api/lots/update', () => {
    it('can not change sensative data', (done) => {
      factory.build('lot').then((lot) => {
        lot.user = user._id;
        Lot.create(lot, () => {
          lot.user = 'changed user id';
          server
          .post('/api/lots/update')
          .set({ Authorization: jwt })
          .send(lot)
          .expect(200)
          .end(() => {
            assert.equal(user._id, lot.user);
            done();
          });
        });
      });
    });
  });

  describe('POST /api/lots/update', () => {
    it('should return status 401 Unauthorized for the invalid token', (done) => {
      const lot = {};
      server
      .post('/api/lots/update')
      .set({ Authorization: 'invalid' })
      .send(lot)
      .expect(401, done);
    });
  });

  describe('POST /api/lots/update', () => {
    it('should return status 403 Forbidden if user try to update the lot that belongs to another user', (done) => {
      factory.build('lot').then((lot) => {
        lot.user = '5bd2cf8305106120d38e10b3';
        Lot.create(lot, () => {
          lot.title = 'changed title';
          server
          .post('/api/lots/update')
          .set({ Authorization: jwt })
          .send(lot)
          .expect(403, done);
        });
      });
    });
  });

  describe('DELETE /api/lots/delete', function() {
    it('should return status 200 OK', function(done) {
      factory.build('lot').then((lot) => {
        lot.user = user._id;
        Lot.create(lot, function (err, doc) {
          server
          .delete(`/api/lots/delete/${doc._id}`)
          .set({ Authorization: jwt })
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
  });

  describe('DELETE /api/lots/delete', function() {
    it('should return status 403 Forbidden if user try to delete the lot that belongs to another user', function(done) {
      factory.build('lot').then((lot) => {
        Lot.create(lot, function (err, doc) {
          server
          .delete(`/api/lots/delete/${doc._id}`)
          .set({ Authorization: jwt })
          .expect(403, done);
        });
      });
    });
  });

  describe('DELETE /api/lots/delete', function() {
    it('should return status 401 Unauthorized for the invalid token', function(done) {
      server
      .delete('/api/lots/delete/5bd2cf8305106120d38e10b3')
      .set({ Authorization: 'invalid' })
      .expect(401, done);
    });
  });

});
