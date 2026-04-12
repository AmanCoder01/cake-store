const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist);

router.route('/:productId')
  .post(toggleWishlist)
  .delete(removeFromWishlist);

module.exports = router;
