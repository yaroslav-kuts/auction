const rp = require('request-promise');
const config = require('../../config/config');

module.exports = async (email, password) => {
  console.log();
  const options = {
    method: 'POST',
    uri: `http://localhost:${config.port}/api/user/login`,
    body: { email, password },
    json: true
  };
  const body = await rp(options);
  return body.token;
};
