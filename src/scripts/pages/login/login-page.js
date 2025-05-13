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
        <div class="background-wrapper">
          <div class="form-login">
            <fieldset>
              <legend>Foraa</legend>
              <h3>Welcome Back</h5>
              <p>Sign in with your email address and password</p>
              <form id="loginForm">
                <label for="email">Email Address</label>
                <input type="email" id="email" placeholder="Email" required />
                <p id="error-message" style="color:red;"></p>
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Password" required />
                <div class="login-option">
                  <label>
                    <input type="checkbox" id="remember" name="remember" />
                    Remember me
                  </label>
                  <a href="#" id="forgot-password">Forgot Password?</a>
                </div>
                <button type="submit" class="button-login">Sign In</button>
              </form>
            <div class="register">
              <p>Don't have an account? <a href="#/register" class="register-link">Sign Up</a></p>
            </div>
            </fieldset>
          </div>
        </div>
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
