const express = require('express');
const router = express.Router();
const { authenticate, identifyUser } = require('../middleware/AuthGuard'); // Ensure this path is correct
const {
  signUpUser,
  signInUser,
  signOutUser,
} = require('../managers/libraryUserManager'); // Ensure this path is correct

// GET /signup - Render the signup form
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

// GET /signin - Render the signin form
router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Sign In' });
});

// GET /dashboard - Render dashboard page with user data
router.get('/dashboard', authenticate, (req, res) => {
  res.render('dashboard', { user: req.user }); // Pass `req.user` to the template
});

// User routes
router.post('/signup', signUpUser);
router.post('/signin', signInUser);

// Logout route
router.get('/signout', signOutUser);

module.exports = router;