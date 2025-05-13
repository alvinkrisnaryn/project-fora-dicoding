import { registerUser } from "../../data/repository.js";

export default class RegisterPresenter {
  constructor({ view }) {
    this._view = view;
  }

  async registerNewUser(name, email, password) {
    try {
      await registerUser(name, email, password);
      this._view.showSuccess("Register berhasil!, Silahkan Login");
      setTimeout(() => {
        window.location.hash = "#/login";
      }, 1500);
    } catch (error) {
      let errorMessage = "Gagal daftar, silahkan coba lagi yaa.";
      if (error.message.includes("Email as ready tak")) {
        errorMessage = "Email sudah terdaftar. Gunakan Email lain.";
      } else if (error.message.includes("Password")){
        errorMessage = "Kata sandi harus minimal 8 karakter";
      } else if (error.message){
        errorMessage = error.message;
      }
      this._view.showError(errorMessage);
    }
  }
}
