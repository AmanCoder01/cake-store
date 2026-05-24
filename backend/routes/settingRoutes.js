const express = require('express');
const settingController = require('../controllers/settingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', settingController.getSettings);
router.patch('/', protect, restrictTo('admin'), settingController.updateSetting);

module.exports = router;
