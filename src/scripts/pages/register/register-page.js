import "../../../styles/pages/register/register.css";
import RegisterPresenter from "./register-presenter";

const RegisterPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Access denied to /register: Already logged in");
      window.location.hash = "#/home";
      return "";
    }

    return `
      <section class="register-section">
        <div class="background-wrapper">
          <h2>Daftar Akun Baru</h2>
          <form id="register-form">
            <input type="text" id="name" placeholder="Nama Lengkap" required />
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password" placeholder="Password" required />
            <button type="submit">Daftar</button>
            <span id="register-message"></span>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById("register-form");
    const messageContainer = document.getElementById("register-message");

    const view = {
      showSuccess(message) {
        messageContainer.innerHTML = message;
      },
      showError(message) {
        messageContainer.innerHTML = message;
      },
    };

    const presenter = new RegisterPresenter({ view });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      if (password.length < 8) {
        view.showError("Kata sandi harus minimal 8 karakter.");
        return;
      }
      if (!email.includes("@") || !email.includes(".")) {
        view.showError("Email tidak valid.");
        return;
      }

      await presenter.registerNewUser(name, email, password);
    });
  },
};

export default RegisterPage;
