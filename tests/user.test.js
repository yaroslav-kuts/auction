const assert = require('chai').assert;
const users = require('../models/users');
const mongoose = require('../models/db');

const userok = { email: 'some22199@email.com',
                 phone: '+1-541-854-3176',
                 firstName: 'John',
                 lastName: 'Dou',
                 birthday: '2018-10-16T09:31:44.992Z' };


describe('User', function() {

  before(async function() {
    await users.truncate();
    console.log('done!');
  });

  describe('#create()', function() {
    it('should add one new user to DB', function(done) {
      users.create(userok).then(async function () {
        let numAfter = await users.count();
        assert.equal(numAfter, 1, 'new user was added');
        done();
      });
    });
  });
});
