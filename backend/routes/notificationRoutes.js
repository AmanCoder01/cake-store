const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.markAllNotificationsAsRead);
router.patch('/:id/read', notificationController.markNotificationAsRead);
router.post('/subscribe', notificationController.subscribeToPush);
router.post('/unsubscribe', notificationController.unsubscribeFromPush);

module.exports = router;
