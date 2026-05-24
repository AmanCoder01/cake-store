const Address = require('../models/addressModel');

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json({ status: 'success', data: { addresses } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.createAddress = async (req, res) => {
  try {
    if (req.body.isDefault === true) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }
    const address = await Address.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({ status: 'success', data: { address } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    if (req.body.isDefault === true) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ status: 'success', data: { address } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
