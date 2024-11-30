const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  signUpUser,
  signInUser,
  signOutUser,
} = require('../managers/librarymanager'); // Corrected import path

// GET /signup - Render the signup form
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up', message: req.flash('error') });
});

// POST /signup - Handle signup form submission
router.post('/signup', signUpUser);

// GET /signin - Render the signin form
router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Sign In', message: req.flash('error') });
});

// POST /signin - Handle signin
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

// GET /dashboard - Render dashboard page with user data
router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard', { user: req.user }); // Pass `req.user` to the template
  } else {
    res.redirect('/users/signin');
  }
});

// Logout route
router.get('/signout', signOutUser);

module.exports = router;