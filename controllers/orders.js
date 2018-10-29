const Lot = require('../models/lot');

const create = async (req, res) => {
    const lot = await Lot.findById(req.body.lot);
    const order = {
        customer: req.body.customer,
        location: req.body.location,
        arrivalType: req.body.arrival || lot.arrivalType,
        status: req.body.status || lot.status
    };
    await Lot.updateOne({ _id: lot }, { order });
    return res.json(order);
};

const update = async (req, res) => {

};

const remove = async (req, res) => {

};

const get = async (req, res) => {

};

module.exports = {
    create,
    get,
    update,
    remove
};