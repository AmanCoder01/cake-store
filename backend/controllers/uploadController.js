const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage (no disk writes)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper: Upload buffer to Cloudinary via stream
const uploadToCloudinary = (buffer, folder = 'cake-store') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// POST /api/upload  — accepts multiple images
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id
    }));

    res.status(200).json({
      status: 'success',
      data: { images }
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Admin: Single upload (for categories, banners, etc.)
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'Please upload an image' });
    }

    const folder = req.query.folder || 'cake-store';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      status: 'success',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

module.exports = { upload, uploadImages, uploadSingleImage };
