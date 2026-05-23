const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getProductReviews,
  createReview
} = require('../controllers/reviewController');

const router = express.Router();

router.route('/:productId')
  .get(getProductReviews)
  .post(protect, createReview);

module.exports = router;
