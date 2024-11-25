document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const formData = new FormData(loginForm);
        const data = {
          email: formData.get('email'),
          password: formData.get('password'),
        };
  
        try {
          const response = await fetch('/users/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || 'Sign in failed');
            return;
          }
  
          // Redirect to the dashboard page
          window.location.href = '/users/dashboard';
        } catch (err) {
          console.error('Error:', err);
          alert('An error occurred while signing in.');
        }
      });
    }
  });