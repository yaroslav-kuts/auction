require('../../app');
const supertest = require('supertest');
const { readFileSync } = require('fs');
const Lot = require('../../models/lot');

const image = './tests/resources/test.jpg';

const server = supertest.agent('http://localhost:3000');

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

describe('/api/lot', function() {

  after(function() {
    Lot.deleteMany({}, function(err) {
      if (err) console.log(err);
    });
  });

  describe('POST /api/lot/create', function() {
    it('should return status 200 OK', function(done) {
      server
      .post('/api/lot/create')
      .send(lot)
      .expect(200)
      .end(function(err, res) {
        done();
      });
    });
  });

  describe('POST /api/lot/create', function() {

    const base64 = new Buffer(readFileSync(image)).toString('base64');

    lot.image = base64;

    it('should return status 200 OK for json with image', function(done) {
      server
      .post('/api/lot/create')
      .send(lot)
      .expect(200)
      .end(function(err, res) {
        done();
      });
    });
  });

});
