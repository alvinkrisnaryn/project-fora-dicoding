import "../../../styles/pages/login/login.css";
import LoginPresenter from "./login-presenter";

const LoginPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Access denied to /login: Already logged in");
      window.location.hash = "#/home";
      return "";
    }

    return `
      <section class="login-section">
        <fieldset>
          <legend>Foraa</legend>
          <h4>Welcome Back</h4>
          <p>Sign in with your email address and password</p>
          <form id="loginForm">
            <label for="email">Email Address</label>
            <input type="email" id="email" placeholder="Email" required />
            <p id="error-message" style="color:red;"></p>

            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Password" required />
            <p id="error-message" style="color:red;"></p>

            <div>
             <input type="checkbox" id="remember" name="remember" />
             <label for="remember">Ingat Saya</label>
            </div>

            <button type="submit">Login</button>
          </form>

          <div>
            <p>Belum punya akun? <a href="#/register" class="register-link">Daftar di sini</a></p>
          </div>
        </fieldset>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error-message");

    const presenter = new LoginPresenter({ view: this });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      await presenter.performLogin(email, password);
    });

    this.showSuccess = () => {};

    this.showError = (message) => {
      errorMessage.textContent = message;
    };
  },
};

export default LoginPage;
