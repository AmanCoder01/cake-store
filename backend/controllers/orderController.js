const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    // Update stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    if (req.body.status === 'Delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    
    // Revenue over time (last 7 days)
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const revenueStats = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days }, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalRevenue: totalSales[0]?.total || 0,
        ordersCount,
        productsCount,
        revenueStats
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
