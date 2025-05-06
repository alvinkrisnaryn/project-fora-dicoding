import { registerUser } from "../../data/repository";
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
        <h2>Daftar Akun Baru</h2>
        <form id="register-form">
          <input type="text" id="name" placeholder="Nama Lengkap" required />
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Daftar</button>
        </form>
        <div id="register-message"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById("register-form");
    const messageContainer = document.getElementById("register-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      await presenter.registerNewUser(name, email, password);

      setTimeout(() => {
        if (
          messageContainer.innerText === "Register berhasil! Silahkan login."
        ) {
          window.location.hash = "/login";
        }
      }, 1500);
    });

    // tambahkan metode view
    this.showSuccess = (message) => {
      messageContainer.innerHTML = message;
    };

    this.showError = (message) => {
      messageContainer.innerHTML = message;
    };
  },
};

export default RegisterPage;
