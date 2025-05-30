import { loginUser } from "../../data/repository.js";
import App from "../app.js";

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
      window.location.hash = "/home";
      App.renderPage();
    } catch (error) {
      this.#view.showError(`Login gagal: ${error.message}`);
    }
  }
}
