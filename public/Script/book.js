const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  genre: { type: String },
  publish_year: { type: Number },
  coverImagePath: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Book', bookSchema);

document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value.trim(); // Get the search input
    if (!query) {
      return alert('Please enter a search term.'); // Warn if the input is empty
    }
  
    try {
      const response = await fetch(`/books/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch search results.');
  
      const results = await response.json();
  
      const searchResults = document.getElementById('searchResults');
      searchResults.innerHTML = '';
  
      if (results.length === 0) {
        searchResults.innerHTML = '<li class="list-group-item text-muted">No results found</li>';
        return;
      }
  
      // Populate search results
      results.forEach(book => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          <span>
            ${book.image ? `<img src="/images/${book.image}" alt="${book.title}" class="book-image">` : ''}
            <strong>${book.title}</strong> by ${book.author} (Published: ${book.publishedDate})
          </span>
          <button class="btn btn-success btn-sm add-book-btn" data-title="${book.title}" data-author="${book.author}" data-publishedDate="${book.publishedDate}">
            <i class="fas fa-plus-circle"></i> Add
          </button>
        `;
        searchResults.appendChild(li);
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching search results.');
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  const searchResults = document.getElementById('searchResults');

  if (searchResults) {
    searchResults.addEventListener('click', async (e) => {
      if (e.target.classList.contains('add-book-btn')) {
        const button = e.target;
        const title = button.getAttribute('data-title');
        const author = button.getAttribute('data-author');
        const publishedDate = button.getAttribute('data-publishedDate');

        const bookData = {
          title,
          author,
          publishedDate,
        };

        try {
          const response = await fetch('/books/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || 'Failed to add book');
            return;
          }

          alert('Book added successfully');
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while adding the book.');
        }
      }
    });
  }
});