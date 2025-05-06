import { postStoryWithLocation } from "../../data/repository.js";
import { stopCamera } from "../../utils/camera.js";

export default class AddPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async submitStory(formData, cleanupCallBack) {
    try {
      await postStoryWithLocation(formData);
      this.#view.showSuccess("Berhasil mengirim review!");

      if (cleanupCallBack) {
        await cleanupCallBack();
      }

      try {
        stopCamera();
      } catch (error) {
        console.warn("Failed to stop camera:", error);
      }

      setTimeout(() => {
        window.location.hash = "#/home";
      }, 1500);
    } catch (error) {
      console.log("Error submmiting story:", error);
      this.#view.showError(`Gagal mengirim review: ${error.message}`);
    }
  }
}
