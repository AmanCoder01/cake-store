const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createCategory);
router.route('/:id')
  .put(updateCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;
