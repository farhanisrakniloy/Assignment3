const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth'); // Ensure authentication middleware is imported
const Book = require('../models/book'); // Ensure the Book model is imported

const router = express.Router();

// Route to render the book library page with required data
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    let books = [];

    // If the user is logged in, fetch their data
    if (req.user) {
      books = await Book.find({ userId: req.user._id });
    }

    res.render('library', {
      books,
      user: req.user || null, // Pass user for additional context
    });
  } catch (error) {
    console.error('Error fetching book data:', error.message);
    res.status(500).render('error', { message: 'Failed to load book data.', error });
  }
});

// API Route: Add a new book entry (requires login)
router.post('/add', ensureAuthenticated, async (req, res) => {
  try {
    const { title, author, publishedDate } = req.body;

    // Ensure all required fields are provided
    if (!title || !author || !publishedDate) {
      return res.status(400).render('error', { message: 'All fields are required.' });
    }

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
});

module.exports = router;