const assert = require('chai').assert;
const supertest = require("supertest");
const app = require('../app');

const server = supertest.agent("http://localhost:3001");


const user = { email: 'yaroslavkuts@gmail.com',
               password: 'testing',
               phone: '+1-541-654-9176',
               firstName: 'John',
               lastName: 'Dou',
               birthday: '1990-10-16T09:31:44.992Z' };

let jwt = undefined;
let changePassToken = undefined;

describe('POST /api/user/signup', function() {
  it('should return status 200 OK', function(done) {
    server
    .post('/api/user/signup')
    .send(user)
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.email, user.email);
      done();
    });
  });
});

describe('GET /api/user/confirm', function() {
  it('should return status 200 OK', function(done) {
    server
    .get(`/api/user/confirm/${user.email}`)
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.message, `${user.email} was activated!`);
      done();
    });
  });
});

describe('POST /api/user/login', function() {
  it('should return status 200 OK', function(done) {
    server
    .post('/api/user/login')
    .send({ email: user.email, password: user.password })
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.status, 200);
      jwt = res.body.token.split(' ')[1];
      done();
    });
  });
});

describe('GET /api/user/checkauth', function() {
  it('should return status 200 OK', function(done) {
    server
    .get('/api/user/checkauth')
    .set({ auth: jwt })
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.isValid, true);
      done();
    });
  });
});

describe('POST /api/user/recovery', function() {
  it('should return status 200 OK', function(done) {
    server
    .post('/api/user/recovery')
    .send({ email: user.email })
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.status, 200);
      changePassToken = res.body.token;
      done();
    });
  });
});
