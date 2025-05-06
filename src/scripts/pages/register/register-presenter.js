import { registerUser } from "../../data/repository.js";

export default class RegisterPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async registerNewUser(name, email, password) {
    try {
      await registerUser(name, email, password);
      this.#view.showSuccess("Registrasi berhasil! Silakan login.");
    } catch (error) {
      this.#view.showError("Gagal daftar. Coba lagi ya.");
    }
  }
}
