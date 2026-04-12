const Category = require('../models/categoryModel');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ status: 'success', data: categories });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Create category
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ status: 'success', data: category });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Update category
exports.updateCategory = async (req, res) => {
  try {
    console.log('Update Category ID:', req.params.id);
    console.log('Update Data:', req.body);
    
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({ status: 'fail', message: 'Category not found' });
    }

    res.status(200).json({ status: 'success', data: category });
  } catch (err) {
    console.error('Update Category Error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Admin: Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
