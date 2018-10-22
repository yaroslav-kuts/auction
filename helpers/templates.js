const config = require('../config/config');

const signup = function (toEmail) {
  return {
    from: 'zndtestdev@gmail.com',
    to: toEmail,
    subject: 'Auction Marketplace: Signup confirmation!',
    html: `<p>To confirm registration follow the link: <a href="http://localhost:${config.port}/api/user/confirm/${toEmail}">confirmation</a></p>`
  };
};

const recovery = function (toEmail, token) {
  return {
    from: 'zndtestdev@gmail.com',
    to: toEmail,
    subject: 'Auction Marketplace: password recovering!',
    html: `<p>To confirm recovering follow the link: <a href="http://localhost:${config.port}/api/user/changepass/${token}">confirmation</a></p>`
  };
};

module.exports = {
  signup,
  recovery
};
