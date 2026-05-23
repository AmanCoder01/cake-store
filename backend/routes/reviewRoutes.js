const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getProductReviews,
  createReview,
  getMyReviews
} = require('../controllers/reviewController');

const router = express.Router();

// Get logged-in user's reviews
router.get('/myreviews', protect, getMyReviews);

router.route('/:productId')
  .get(getProductReviews)
  .post(protect, createReview);

module.exports = router;
