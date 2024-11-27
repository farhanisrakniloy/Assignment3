const User = require('server\model\libUser.js');
const jwt = require('jsonwebtoken');

// Create JWT Token
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Sign Up User
const signUpUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('signup', { message: 'Email already in use' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    if (newUser) {
      const token = createToken(newUser._id);
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .redirect('/users/dashboard');
    } else {
      res.status(400).render('signup', { message: 'User creation failed. Please try again.' });
    }
  } catch (err) {
    res.status(400).render('signup', { message: 'Error: ' + err.message });
  }
};

// Sign In User
const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = createToken(user._id);
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .redirect('/users/dashboard');
    } else {
      res.status(400).render('signin', { message: 'Incorrect email or password' });
    }
  } catch (err) {
    res.status(400).render('signin', { message: 'Error: ' + err.message });
  }
};

// Sign Out User
const signOutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/users/signin');
};

module.exports = {
  signUpUser,
  signInUser,
  signOutUser,
};