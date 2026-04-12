const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Wishlist must belong to a user']
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Wishlist item must reference a product']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only add a product once
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
