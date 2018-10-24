const Bid = require('../models/bid');
const Lot = require('../models/lot');

const create = async function(req, res) {
  const bid = req.body;
  bid.user = req.user.id;
  const lot = Lot.findById(req.body.lot);
  if (lot.user === req.user.id) return res.status(405).json({ message: 'Bid creation for own lot not allowed'});
  await Bid.create(bid);
  return res.json(bid);
};

const get = async function(req, res) {
  //
};

module.exports = {
  create,
  get
};
