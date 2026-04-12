const express = require('express');
const { getBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getBanners);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createBanner);
router.route('/:id')
  .patch(updateBanner)
  .delete(deleteBanner);

module.exports = router;
