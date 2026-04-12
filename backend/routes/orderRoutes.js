const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/myorders', orderController.getMyOrders);

// Admin only
router.get('/all', restrictTo('admin'), orderController.getAllOrders);
router.get('/stats', restrictTo('admin'), orderController.getAdminStats);
router.patch('/:id/status', restrictTo('admin'), orderController.updateOrderStatus);

module.exports = router;
