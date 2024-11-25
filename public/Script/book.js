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