import { registerUser } from "../../data/repository";

const RegisterPage = {
  async render() {
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

      try {
        await registerUser(name, email, password);
        messageContainer.innerText = "Registrasi berhasil! Silakan login.";
        setTimeout(() => {
          window.location.hash = "/login";
        }, 1500);
      } catch (error) {
        messageContainer.innerText = "Gagal daftar. Coba lagi ya.";
      }
    });
  },
};

export default RegisterPage;
