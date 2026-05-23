const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: { notifications }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { notification }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

const webpush = require('web-push');
const User = require('../models/userModel');

// Initialize Web Push with VAPID details
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:amancoder01@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Controller to save a push subscription for a user
exports.subscribeToPush = async (req, res) => {
  try {
    const subscription = req.body;
    
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ status: 'fail', message: 'Invalid subscription payload' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if subscription already exists to prevent duplicate endpoints
    const exists = user.pushSubscriptions.some(sub => sub.endpoint === subscription.endpoint);
    if (!exists) {
      user.pushSubscriptions.push(subscription);
      await user.save({ validateBeforeSave: false });
    }

    res.status(201).json({
      status: 'success',
      message: 'Subscription saved successfully'
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Controller to remove a push subscription for a user
exports.unsubscribeFromPush = async (req, res) => {
  try {
    const { endpoint } = req.body;
    const user = await User.findById(req.user._id);
    
    user.pushSubscriptions = user.pushSubscriptions.filter(sub => sub.endpoint !== endpoint);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Subscription removed successfully'
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Helper function to send web push notifications to all registered devices of a recipient
exports.sendPushNotification = async (recipientId, title, message, url = '/') => {
  try {
    const user = await User.findById(recipientId);
    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) return;

    const payload = JSON.stringify({
      title,
      body: message,
      url
    });

    const sendPromises = user.pushSubscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);
      } catch (err) {
        // StatusCode 410 or 404 indicates subscription is expired or ceased to exist
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Removing expired subscription: ${subscription.endpoint}`);
          await User.findByIdAndUpdate(recipientId, {
            $pull: { pushSubscriptions: { endpoint: subscription.endpoint } }
          });
        } else {
          console.error('Error sending push notification to endpoint:', err);
        }
      }
    });

    await Promise.all(sendPromises);
  } catch (err) {
    console.error('Error in sendPushNotification helper:', err);
  }
};

