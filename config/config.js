module.exports = {
  port: 3000,
  jwtsecret: process.env.SECRET,
  saltRounds: 10,
  expiresIn: '2h',
  poolSize: 10,
  sizeLimit: '1mb'
};
