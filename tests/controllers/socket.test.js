require('../../app');
const assert = require('chai').assert;
const client = require('socket.io-client');
const config = require('../../config/config');
const db = require('../../db');
const token = require('../helpers/credentials');
const factory = require('../helpers/factory');
const User = require('../../models/user');
const Lot = require('../../models/lot');
const Bid = require('../../models/bid');
const rp = require('request-promise');


describe('Bids realtime processing', () => {

    let user, lot, jwt;

    beforeEach(async () => {
        user = await factory.build('user');
        await User.create(user);
        lot = await factory.build('lot');
        await Lot.create(lot);
        jwt = await token(user.email, 'password');
    });

    after(() => db.clean());

    it('should show existed bids', (done) => {
        const socket = client(`http://localhost:${config.port}`, { query: `lot=${lot._id.toString()}` });
        factory.build('bid').then((bid) => {
            bid.lot = lot._id.toString();
            bid.user = '5bd6f6b5c09d1737b801e6d1';
            bid.createdAt = new Date();

            Bid.create(bid, (err) => {
                if (err) throw err;
                socket.on('open', (data) => {
                    const actual = JSON.parse(data);
                    assert.isTrue(actual.length === 1);
                    done();
                });
            });
        });
    });

    it('should show newly created bid', (done) => {
        const socket = client(`http://localhost:${config.port}`, { query: `lot=${lot._id.toString()}` });
        factory.build('bid').then((bid) => {
            bid.lot = lot._id.toString();
            bid.createdAt = new Date();

            socket.on('bid', (data) => {
                const actual = JSON.parse(data);
                assert.equal(actual.lot, bid.lot);
                assert.equal(actual.price, bid.price);
                done();
            });

            const options = {
                method: 'POST',
                uri: `http://localhost:${config.port}/api/bids/create`,
                body: bid,
                json: true,
                headers: {
                    Authorization: jwt
                }
            };
            rp(options);
        });
    });

    it('should show only bids that belong to specific lot', (done) => {
        const socket = client(`http://localhost:${config.port}`, { query: `lot=${lot._id.toString()}` });
        factory.build('bid').then((bid) => {
            bid.lot = '5bd6f6b5c09d1737b801e6d1';
            bid.user = '5bd6f6dac09d1737b801e6d2';
            bid.createdAt = new Date();

            Bid.create(bid, (err) => {
                if (err) throw err;
                socket.on('open', (data) => {
                    const actual = JSON.parse(data);
                    assert.isTrue(actual.length === 0);
                    done();
                });
            });
        });
    });
});