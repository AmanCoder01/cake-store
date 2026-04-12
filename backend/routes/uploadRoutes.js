const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { upload, uploadImages, uploadSingleImage } = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload — Admin only, up to 5 images at a time
router.post('/', protect, restrictTo('admin'), upload.array('images', 5), uploadImages);

// POST /api/upload/single — Admin only, single image
router.post('/single', protect, restrictTo('admin'), upload.single('file'), uploadSingleImage);

module.exports = router;
