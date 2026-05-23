const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');

// GET /api/reviews/:productId — Get all reviews for a specific product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// POST /api/reviews/:productId — Create a review for a product (after delivery)
exports.createReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const productId = req.params.productId;
    const userId = req.user._id;

    if (!rating || !review) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both rating and review text'
      });
    }

    // 1. Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already submitted a review for this product'
      });
    }

    // 2. Validate that the product has been delivered to this user in a completed order
    const deliveredOrder = await Order.findOne({
      user: userId,
      status: 'Delivered',
      'orderItems.product': productId
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only write a review for products that have been purchased and successfully delivered to you!'
      });
    }

    // 3. Create the review
    const newReview = await Review.create({
      user: userId,
      product: productId,
      rating,
      review
    });

    // Populate user details for returning
    const populatedReview = await newReview.populate('user', 'name');

    res.status(201).json({
      status: 'success',
      data: { review: populatedReview }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// GET /api/reviews/myreviews — Get all reviews written by the logged-in user
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id });
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
