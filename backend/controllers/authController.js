const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'super-secret-cake-store-key-123456';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'customer'
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password!' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
};
