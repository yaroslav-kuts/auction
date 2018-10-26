const Lot = require('../models/lot');
const Bid = require('../models/bid');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const create = async function (req, res) {
  let lot = req.body;
  lot.user = req.user.id;

  const base64 = lot.image;
  lot.image = '';

  const created = await Lot.create(lot);
  const dir = `${__dirname.replace('/controllers', '')}/images/${created._id.toString()}`;
  const path =  `${dir}/image.jpg`;

  await Lot.updateOne({ _id: created._id }, { image: path }).exec();
  await mkdir(dir);
  await writeFile(path, base64, 'base64');
  return res.json(created);
};

const getLot = async function (req, res) {
  const lot = await Lot.findById(req.params.id);
  if (lot.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  return res.json(lot);
};

const myLots = async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const created = await Lot.find({ user: req.user.id });
  const bids = await Bid.find({ user: req.user.id }).populate('lot');
  let lots = bids.map(bid => bid.lot).concat(created);
  return res.json({ lots: lots.slice((page - 1) * limit, page * limit) });
};

const allLots = async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const lots = await Lot.paginate({ status: 'inProgress' }, { page, limit });
  return res.json({ lots });
};

const update = async function (req, res) {
  if (req.user.id !== req.body.user.toString()) return res.status(403).json({ message: 'Forbidden' });
  const lot = await Lot.findById(req.body._id);
  lot.title = req.body.title || lot.title;
  lot.description = req.body.description || lot.description;
  lot.currentPrice = req.body.currentPrice || lot.currentPrice;
  lot.image = req.body.image || lot.image;
  await Lot.updateOne({ _id: req.body._id }, lot).exec();
  return res.json(lot);
};

const remove = async function (req, res) {
  const lot = await Lot.findById(req.params.id);
  if (req.user.id !== lot.user.toString()) return res.status(403).json({ message: 'Forbidden' });
  await Lot.deleteOne({ _id: lot._id }).exec();
  return res.json({ message: 'Lot was deleted'});
};

module.exports = {
  create,
  getLot,
  myLots,
  allLots,
  update,
  remove
};
