require('../../app');
const assert = require('chai').assert;
const supertest = require('supertest');
const User = require('../../models/user');
const db = require('../../db/db');

const server = supertest.agent("http://localhost:3000");

describe('/api/user', function() {

  const user = {
    email: 'yaroslavkuts@gmail.com',
    password: 'testing',
    phone: '+1-541-654-9176',
    firstName: 'John',
    lastName: 'Dou',
    birthday: '1990-10-16T09:31:44.992Z'
  };

  let jwt, changePassToken, newpass = 'newpass';

  after(function() {
    db.clean();
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

  describe('POST /api/user/signup', function() {

    const user = {
      email: 'yaroslavkuts@gmail.com',
      password: 'testing',
      phone: '+1-541-654-9176',
      firstName: 'John',
      lastName: 'Dou',
      birthday: '1998-10-16T09:31:44.992Z'
    };

    it('should return status 422 Unprocessable Entity for user with age less than 21', function(done) {
      server
      .post('/api/user/signup')
      .send(user)
      .expect(422)
      .end(function(err, res) {
        assert.isTrue(res.body.errors.length === 1);
        done();
      });
    });
  });

  describe('POST /api/user/signup', function() {

    const user = {
      email: 'yaroslavkuts@gmail.com',
      password: 'testing',
      phone: '+1-541-654-91',
      firstName: 'John',
      lastName: 'Dou',
      birthday: '1990-10-16T09:31:44.992Z'
    };

    it('should return status 422 Unprocessable Entity for user with not valid phone', function(done) {
      server
      .post('/api/user/signup')
      .send(user)
      .expect(422)
      .end(function(err, res) {
        assert.isTrue(res.body.errors.length === 1);
        done();
      });
    });
  });

  describe('POST /api/user/signup', function() {

    const user = {
      email: 'yaroslavkutsgmail.com',
      password: 'testing',
      phone: '+1-541-654-9176',
      firstName: 'John',
      lastName: 'Dou',
      birthday: '1990-10-16T09:31:44.992Z'
    };

    it('should return status 422 Unprocessable Entity for user with not valid email', function(done) {
      server
      .post('/api/user/signup')
      .send(user)
      .expect(422)
      .end(function(err, res) {
        assert.isTrue(res.body.errors.length === 1);
        done();
      });
    });
  });

  describe('POST /api/user/signup', function() {

    const user = {
      email: 'yaroslavkuts@gmail.com',
      password: '',
      phone: '+1-541-654-9176',
      firstName: 'John',
      lastName: 'Dou',
      birthday: '1990-10-16T09:31:44.992Z'
    };

    it('should return status 422 Unprocessable Entity for password length less than 4', function(done) {
      server
      .post('/api/user/signup')
      .send(user)
      .expect(422)
      .end(function(err, res) {
        assert.isTrue(res.body.errors.length === 1);
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
        jwt = res.body.token;
        done();
      });
    });
  });

  describe('GET /api/user/checkauth', function() {
    it('should return status 200 OK', function(done) {
      server
      .get('/api/user/checkauth')
      .set({ Authorization: jwt })
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
        jwt = res.body.token;
        done();
      });
    });
  });

  describe('GET /api/user/checkauth', function() {
    it('should confirm that token got with new password is valid', function(done) {
      server
      .get('/api/user/checkauth')
      .set({ Authorization: jwt })
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
      .set({ Authorization: jwt })
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
      .set({ Authorization: jwt })
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body.isValid, false);
        done();
      });
    });
  });
});
