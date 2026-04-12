const express = require('express');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(productController.getAllProducts)
  .post(protect, restrictTo('admin'), productController.createProduct);

router.route('/:id')
  .get(productController.getProduct)
  .patch(protect, restrictTo('admin'), productController.updateProduct)
  .delete(protect, restrictTo('admin'), productController.deleteProduct);

module.exports = router;
