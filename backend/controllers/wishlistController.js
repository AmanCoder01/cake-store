const Wishlist = require('../models/wishlistModel');

// GET /api/wishlist — get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate('product', 'name price images category ratingsAverage stock')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// POST /api/wishlist/:productId — toggle add/remove
exports.toggleWishlist = async (req, res) => {
  try {
    const deleted = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId
    });

    if (deleted) {
      return res.status(200).json({
        status: 'success',
        action: 'removed',
        message: 'Removed from wishlist'
      });
    }

    await Wishlist.create({
      user: req.user._id,
      product: req.params.productId
    });

    res.status(201).json({
      status: 'success',
      action: 'added',
      message: 'Added to wishlist'
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// DELETE /api/wishlist/:productId — remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId
    });

    res.status(200).json({
      status: 'success',
      message: 'Removed from wishlist'
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
