const Book = require('../model/book');
const User = require('../model/libUser');
const jwt = require('jsonwebtoken');

// Create JWT Token
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Create a new book record
const createBook = async (req, res) => {
  try {
    const { title, author, publishedDate } = req.body;

    // Normalize the title for consistent image file naming
    const normalizedTitle = title.trim().toLowerCase();

    // Insert a new book record
    await Book.create({
      title: normalizedTitle,
      author,
      publishedDate,
      userId: req.user._id,
      image: `${normalizedTitle.replace(/\s+/g, '_')}.jpg`, // Auto-generate image name
    });

    res.redirect('/books'); // Redirect to the book list after successful creation
  } catch (err) {
    res.status(400).render('error', { message: 'Unable to create book. ' + err.message });
  }
};

// Retrieve all book records for the logged-in user
const fetchBooks = async (req, res) => {
  try {
    // Retrieve all books for the logged-in user
    const books = await Book.find({ userId: req.user._id });

    res.render('books', { books });
  } catch (err) {
    res.status(400).render('error', { message: 'Unable to fetch books. ' + err.message });
  }
};

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
  createBook,
  fetchBooks,
  signUpUser,
  signInUser,
  signOutUser,
};