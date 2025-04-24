const LoginPage = {
  async render() {
    return `
      <section class="login-section">
        <h2>Login ke Website Fora</h2>
        <form id="loginForm">
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p id="error-message" style="color:red;"></p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        localStorage.setItem('token', result.loginResult.token);
        localStorage.setItem('name', result.loginResult.name); // opsional
        window.location.replace('#/home');
      } catch (error) {
        errorMessage.textContent = `Login gagal: ${error.message}`;
      }
    });
  }
};

export default LoginPage;
