document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
  
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const formData = new FormData(registerForm);
        const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
          favoriteGenre: formData.get('favoriteGenre'),
        };
  
        try {
          const response = await fetch('/users/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
  
          const result = await response.json();
  
          if (response.ok) {
            localStorage.setItem('authToken', result.token); // Save the token in localStorage
            window.location.href = '/users/dashboard'; // Redirect to dashboard
          } else {
            alert(result.message || 'Registration failed');
          }
        } catch (err) {
          console.error('Error:', err);
          alert('An error occurred while registering.');
        }
      });
    }
  });