import { getStoryById } from "../../data/repository.js";

export default class DetailPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async loadStory(id) {
    try {
      const story = await getStoryById(id);
      if (!story) {
        this.#view.showError(
          "Cerita tidak ditemukan. Pastikan ID cerita valid atau coba lagi nanti."
        );
        return;
      }
      this.#view.showStory(story);
    } catch (error) {
      this.#view.showError(`Error: ${error.message}`);
    }
  }
}
