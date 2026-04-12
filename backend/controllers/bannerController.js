const Banner = require('../models/bannerModel');

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort('order');
    res.status(200).json({ status: 'success', data: banners });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Create banner
exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ status: 'success', data: banner });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Update banner
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: banner });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Delete banner
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
