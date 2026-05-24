const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Address must belong to a user']
  },
  address: {
    type: String,
    required: [true, 'Please provide your address']
  },
  city: {
    type: String,
    required: [true, 'Please provide your city']
  },
  postalCode: {
    type: String,
    required: [true, 'Please provide your postal code']
  },
  country: {
    type: String,
    required: [true, 'Please provide your country']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  distance: {
    type: Number,
    required: [true, 'Please provide the distance to the outlet in km'],
    default: 1.5
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
