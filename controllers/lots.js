const Lot = require('../models/lot');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const create = async function (req, res) {
  const lot = req.body;
  const base64 = lot.image;
  lot.image = '';

  const created = await Lot.create(lot);
  const dir = `${__dirname.replace('/controllers', '')}/images/${created._id.toString()}`;
  //TODO: handle picture extension
  const path =  `${dir}/image.jpg`;

  await Lot.updateOne({ _id: created._id }, { image: path }).exec();
  await mkdir(dir);
  await writeFile(path, base64, 'base64');
  return res.json({});
};

module.exports = {
  create
};
