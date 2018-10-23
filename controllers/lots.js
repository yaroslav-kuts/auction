const Lot = require('../models/lot');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const create = async function (req, res) {
  const lot = req.body;

  //TODO add helper function for extraction token from request
  const token = req.get('Authorization').split(' ')[1];
  lot.user = jwt.verify(token, config.jwtsecret).id;

  const base64 = lot.image;
  lot.image = '';

  const created = await Lot.create(lot);
  const dir = `${__dirname.replace('/controllers', '')}/images/${created._id.toString()}`;
  //TODO: handle picture extension
  const path =  `${dir}/image.jpg`;

  await Lot.updateOne({ _id: created._id }, { image: path }).exec();
  await mkdir(dir);
  await writeFile(path, base64, 'base64');
  return res.json({ message: 'Lot was created', id: created._id });
};

const remove = async function (req, res) {
  const lot = await Lot.findById(req.body._id);
  //TODO add helper function for extraction token from request
  const token = req.get('Authorization').split(' ')[1];
  const user = jwt.verify(token, config.jwtsecret).id;
  if (user !== lot.user.toString()) return res.status(403).json({ message: 'Forbidden' });
  await Lot.deleteOne({ _id: lot._id }).exec();
  return res.json({ message: 'Lot was deleted'});
};

module.exports = {
  create,
  remove
};
