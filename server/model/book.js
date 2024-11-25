const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    minlength: [2, 'Book title must be at least 2 characters'],
    maxlength: [100, 'Book title must be at most 100 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    minlength: [2, 'Author name must be at least 2 characters'],
    maxlength: [50, 'Author name must be at most 50 characters'],
  },
  publishedDate: {
    type: String,
    required: [true, 'Published date is required'],
    validate: {
      validator: function (value) {
        // Check if date is in YYYY-MM-DD format
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      },
      message: 'Published date must be in YYYY-MM-DD format',
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String, // Image filename (e.g., "book_cover.jpg")
    required: [true, 'Image is required'],
  },
});

module.exports = mongoose.model('Book', bookSchema);