const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  subtitle: String,
  image: {
    url: {
        type: String,
        required: [true, 'Banner image is required']
    },
    public_id: String
  },
  link: {
    type: String,
    default: '/products'
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
