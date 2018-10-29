require('../../app');
const assert = require('chai').assert;
const supertest = require('supertest');A
const config = require('../../config/config');
const db = require('../../db');
const token = require('../helpers/credentials');
const factory = require('../helpers/factory');
const client = require('../helpers/socket');
const User = require('../../models/user');
const Lot = require('../../models/lot');

const server = supertest.agent(`http://localhost:${config.port}`);

describe('Realtime bids processing', () => {

    let user, lot, jwt;

    before(async () => {
        user = await factory.build('user');
        await User.create(user);
        lot = await factory.build('lot');
        await Lot.create(lot);
        jwt = await token(user.email, 'password');
    });

    after(() => db.clean());

    describe('Existed bids list', () => {
        it('should show all previously created bids', (done) => {
            factory.build('bid').then((bid) => {
                bid.lot = lot._id;
                bid.createdAt = new Date();
                server
                .post('/api/bids/create')
                .set({ Authorization: jwt })
                .send(bid)
                .expect(200)
                .end(() => {
                    client(lot._id.toString(), (data) => {
                        assert.isTrue(JSON.parse(data).length === 1);
                        done();
                    });
                });
            });
        });
    });
});