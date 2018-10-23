const users = require('./models/users');
const lots = require('./models/lots');
const bids = require('./models/bids');

const main = async function () {
  try {
    const johnDou = await users.create({ email: 'testik@email.com',
                                        phone: '+1-541-754-3010',
                                        firstName: 'John',
                                        lastName: 'Dou',
                                        birthday: '2018-10-16T09:31:44.992Z' });
    console.log('Created user: ' + johnDou);

    const barFoo = await users.create({ email: 'netestik@email.com',
                                        phone: '+1-541-754-3011',
                                        firstName: 'Bar',
                                        lastName: 'Foo',
                                        birthday: '2018-10-16T09:31:44.992Z' });
    console.log('Created user: ' + barFoo);

    const lot1 = { title: 'TestProduct',
                   user: johnDou._id,
                   image: './img/testproduct.jpg',
                   description: 'Simple test product.',
                   status: 'inProgress',
                   createdAt: '2018-10-16T09:31:44.992Z',
                   currentPrice: 100,
                   estimatedPrice: 300,
                   startTime: '2018-10-16T09:31:44.992Z',
                   endTime: '2018-10-16T09:31:44.992Z',
                   order: {
                     customer: barFoo._id,
                     location: 'Cool street, 14',
                     arrivalType: 'dhlExpress'
                   }};

    const lot = await lots.create(lot1);
    console.log('Created lot: ' + lot);

    const bid1 = { createdAt: '2018-10-16T09:31:44.992Z',
                   price: 10,
                   lot: lot._id,
                   user: barFoo._id };

    const bid = await bids.create(bid1);
    bids.then();
    console.log('Created bid: ' + bid);
  } catch (err) {
    console.log(err);
    console.log('hello');
  }
};

main();

// Tasks:
//
// 1) bcrypt salt - DONE
// 2) export models not methods - DONE
// 3) controllers and routes - DONE
// 4) add index html
// 5) logout - DONE
// 6) add api for check auth if valid token and exp date - DONE
