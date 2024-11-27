const express = require('express');
const router = express.Router();
const Book = require('../model/book.js'); // Ensure the Book model is imported

// GET /book - Render the book page with books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('book', { books, user: req.user });
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).render('error', { message: 'Failed to load books.', error });
  }
});

// GET /library - Render the library page with books
router.get('/library', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('library', { books, user: req.user });
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).render('error', { message: 'Failed to load books.', error });
  }
});

// API Route: Add a new book entry (requires login)
router.post('/add', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, author, description, genre, publish_year, coverImagePath } = req.body;
    const newBook = new Book({
      title,
      author,
      description,
      genre,
      publish_year,
      coverImagePath,
      userId: req.user._id,
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ message: 'Failed to add book', error });
  }
});

module.exports = router;