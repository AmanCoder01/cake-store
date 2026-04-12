const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Search
    if (req.query.search) {
      query = query.find({
        name: { $regex: req.query.search, $options: 'i' }
      });
    }

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 12;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const products = await query;
    const total = await Product.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      data: { products }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'No product found with that ID' });
    }
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', data: { product: newProduct } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: 'No product found with that ID' });
    }
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'No product found with that ID' });
    }
    res.status(200).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
