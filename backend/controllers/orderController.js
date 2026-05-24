const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check if outlet is open or closed
    const Setting = require('../models/settingModel');
    const isOutletOpenSetting = await Setting.findOne({ key: 'isOutletOpen' });
    if (isOutletOpenSetting && isOutletOpenSetting.value === false) {
      const closeReasonSetting = await Setting.findOne({ key: 'closeReason' });
      const reason = closeReasonSetting ? closeReasonSetting.value : 'baking and maintenance';
      return res.status(400).json({
        status: 'fail',
        message: `Sorry, our outlet is currently closed due to: "${reason}". We are not accepting new orders at this time.`
      });
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

    // Create notifications for all admin users
    try {
      const admins = await User.find({ role: 'admin' });
      const notifications = await Notification.insertMany(
        admins.map(admin => ({
          recipient: admin._id,
          type: 'NEW_ORDER',
          title: 'New Order Placed! 🎂',
          message: `Order #${order._id.toString().substring(18)} for ₹${order.totalPrice} has been placed.`,
          orderId: order._id
        }))
      );

      // Emit Socket.io event to online admins
      const io = req.app.get('io');
      const activeSockets = req.app.get('activeSockets');
      if (io && activeSockets) {
        notifications.forEach(notif => {
          const socketId = activeSockets.get(notif.recipient.toString());
          if (socketId) {
            io.to(socketId).emit('new-notification', notif);
          }
        });
      }

      // Send Web Push notification to all admins (even if browser is closed)
      const { sendPushNotification } = require('./notificationController');
      notifications.forEach(notif => {
        sendPushNotification(
          notif.recipient,
          notif.title,
          notif.message,
          '/admin/orders'
        );
      });
    } catch (notifErr) {
      console.error('Failed to send order notifications:', notifErr);
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

    // Create notification for the customer
    try {
      const notification = await Notification.create({
        recipient: order.user,
        type: 'ORDER_STATUS_UPDATE',
        title: 'Order Status Updated! 🚚',
        message: `Your order #${order._id.toString().substring(18)} status is now "${order.status}".`,
        orderId: order._id
      });

      // Emit Socket.io event in real-time to the online customer
      const io = req.app.get('io');
      const activeSockets = req.app.get('activeSockets');
      if (io && activeSockets) {
        const socketId = activeSockets.get(order.user.toString());
        if (socketId) {
          io.to(socketId).emit('new-notification', notification);
        }
      }

      // Send Web Push notification to the customer (even if browser is closed)
      const { sendPushNotification } = require('./notificationController');
      sendPushNotification(
        notification.recipient,
        notification.title,
        notification.message,
        '/orders'
      );
    } catch (notifErr) {
      console.error('Failed to create status update notification:', notifErr);
    }

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
    const usersCount = await User.countDocuments();
    
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
        usersCount,
        revenueStats
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
