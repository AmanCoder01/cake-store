const express = require('express');
const addressController = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(addressController.getAddresses)
  .post(addressController.createAddress);

router.route('/:id')
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;
