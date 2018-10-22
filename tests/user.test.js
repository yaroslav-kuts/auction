const assert = require('chai').assert;
const supertest = require('supertest');
const User = require('../models/user');
const app = require('../app');

const server = supertest.agent("http://localhost:3000");


const user = { email: 'yaroslavkuts@gmail.com',
               password: 'testing',
               phone: '+1-541-654-9176',
               firstName: 'John',
               lastName: 'Dou',
               birthday: '1990-10-16T09:31:44.992Z' };

let jwt, changePassToken, newpass = 'newpass';

describe('/api/user', function() {

  after(function() {
    User.deleteMany({}, function(err) {
      if (err) console.log(err);
    });
  });

  describe('POST /api/user/signup', function() {
    it('should return status 200 OK', function(done) {
      server
      .post('/api/user/signup')
      .send(user)
      .expect(200)
      .end(function(err, res) {
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
        assert.equal(res.body.message, `${user.email} was activated.`);
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
        changePassToken = res.body.token;
        done();
      });
    });
  });

  describe('POST /api/user/change/password', function() {
    it('should store new valid password', function(done) {
      server
      .post('/api/user/change/password')
      .send({ email: user.email,
              token: changePassToken,
              password: newpass })
      .expect(200)
      .end(function(err, res) {
        console.log();
        done();
      });
    });
  });

  describe('POST /api/user/login', function() {
    it('should get token for new password', function(done) {
      server
      .post('/api/user/login')
      .send({ email: user.email, password: newpass })
      .expect(200)
      .end(function(err, res) {
        jwt = res.body.token.split(' ')[1];
        done();
      });
    });
  });

  describe('GET /api/user/checkauth', function() {
    it('should confirm that token got with new password is valid', function(done) {
      server
      .get('/api/user/checkauth')
      .set({ auth: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.isValid, true);
        done();
      });
    });
  });

  describe('POST /api/user/logout', function() {
    it('should return status 200 OK', function(done) {
      server
      .post('/api/user/logout')
      .set({ auth: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.message, 'Token invalid. User logged out successfully.');
        done();
      });
    });
  });

  describe('GET /api/user/checkauth', function() {
    it('should confirm that revoked token is not valid', function(done) {
      server
      .get('/api/user/checkauth')
      .set({ auth: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.isValid, false);
        done();
      });
    });
  });
});
