import { loginUser } from "../../data/repository.js";

export default class LoginPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async performLogin(email, password) {
    try {
      const token = await loginUser(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("name", "User"); // Sesuaikan dengan response jika ada name
      this.#view.showSuccess();
      setTimeout(() => {
        window.location.hash = "#/home";
      }, 100);
    } catch (error) {
      this.#view.showError(`Login gagal: ${error.message}`);
    }
  }
}
