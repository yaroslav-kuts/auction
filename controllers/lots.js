const Lot = require('../models/lot');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const create = async function (req, res) {
  const lot = req.body;
  lot.user = req.user.id;

  const base64 = lot.image;
  lot.image = '';

  const created = await Lot.create(lot);
  const dir = `${__dirname.replace('/controllers', '')}/images/${created._id.toString()}`;
  const path =  `${dir}/image.jpg`;

  await Lot.updateOne({ _id: created._id }, { image: path }).exec();
  await mkdir(dir);
  await writeFile(path, base64, 'base64');
  return res.json({ message: 'Lot was created', id: created._id });
};

const myLots = async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const lots = await Lot.paginate({ user: req.user.id }, { page, limit });
  return res.json({ lots });
};

const allLots = async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const lots = await Lot.paginate({ status: 'inProgress' }, { page, limit });
  return res.json({ lots });
};

const update = async function (req, res) {
  const lot = req.body;
  if (req.user.id !== lot.user.toString()) return res.status(403).json({ message: 'Forbidden' });
  await Lot.updateOne({ _id: lot._id }, lot).exec();
  return res.json({ message: 'Lot was updated'});
};

const remove = async function (req, res) {
  const lot = await Lot.findById(req.body._id);
  if (req.user.id !== lot.user.toString()) return res.status(403).json({ message: 'Forbidden' });
  await Lot.deleteOne({ _id: lot._id }).exec();
  return res.json({ message: 'Lot was deleted'});
};

module.exports = {
  create,
  myLots,
  allLots,
  update,
  remove
};
