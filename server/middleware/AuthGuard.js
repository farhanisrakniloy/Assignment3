const jwt = require('jsonwebtoken');
const User = require('../models/libUser'); // Ensure the User model is imported

const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
};

const identifyUser = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      console.error('Token verification failed:', err.message);
    }
  }
  next();
};

module.exports = {
  authenticate,
  identifyUser,
};