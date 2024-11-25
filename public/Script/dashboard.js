document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      alert('Access denied. Please sign in.');
      window.location.href = '/signin';
      return;
    }
  
    const totalBooksElement = document.getElementById('totalBooks');
    const bookListElement = document.getElementById('bookList');
    const addBookForm = document.getElementById('addBookForm');
    const logoutButton = document.getElementById('logoutButton');
    const loadingElement = document.getElementById('loading');
  
    const showLoading = () => (loadingElement.style.display = 'block');
    const hideLoading = () => (loadingElement.style.display = 'none');
  
    const handleFetchError = async (response) => {
      if (response.status === 401) {
        alert('Session expired. Please sign in again.');
        localStorage.removeItem('authToken');
        window.location.href = '/signin';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      }
    };
  
    const fetchBooks = async () => {
      try {
        showLoading();
        const response = await fetch('/books', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          await handleFetchError(response);
        }
  
        const data = await response.json();
        hideLoading();
        totalBooksElement.textContent = data.books.length;
        bookListElement.innerHTML = data.books.map(book => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>
              ${book.image ? `<img src="/images/${book.image}" alt="${book.title}" class="book-image">` : ''}
              <strong>${book.title}</strong> by ${book.author} (Published: ${book.publishedDate})
            </span>
            <button class="btn btn-danger btn-sm" onclick="deleteBook('${book._id}')">
              <i class="fas fa-trash-alt"></i> Delete
            </button>
          </li>
        `).join('');
      } catch (error) {
        hideLoading();
        alert(error.message);
      }
    };
  
    const addBook = async (event) => {
      event.preventDefault();
      const formData = new FormData(addBookForm);
      const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        publishedDate: formData.get('publishedDate')
      };
  
      try {
        showLoading();
        const response = await fetch('/books/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookData)
        });
  
        if (!response.ok) {
          await handleFetchError(response);
        }
  
        addBookForm.reset();
        fetchBooks();
      } catch (error) {
        hideLoading();
        alert(error.message);
      }
    };
  
    const deleteBook = async (bookId) => {
      if (!confirm('Are you sure you want to delete this book?')) return;
  
      try {
        showLoading();
        const response = await fetch(`/books/delete/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          await handleFetchError(response);
        }
  
        fetchBooks();
      } catch (error) {
        hideLoading();
        alert(error.message);
      }
    };
  
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
    });
  
    addBookForm.addEventListener('submit', addBook);
    fetchBooks();
  });