import { getStoryById, toggleFavoriteStory } from "../../data/repository.js";

export default class DetailPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async loadStory(id) {
    if (!id || !id.startsWith("story-")) {
      this.#view.showError(
        "ID cerita tidak valid. Harus dimulai dengan 'story-'."
      );
      return;
    }

    try {
      const story = await getStoryById(id);
      if (!story) {
        this.#view.showError(
          "Cerita tidak ditemukan. Pastikan ID cerita valid atau coba lagi nanti."
        );
        return;
      }
      this.#view.showStory(story);
      this.#view.bindFavoriteButton(() => this.#toggleFavorite(id));
    } catch (error) {
      console.error("Error loading story:", error);
      this.#view.showError(`Gagal memuat cerita: ${error.message}`);
    }
  }

  async #toggleFavorite(id) {
    try {
      const isFavorite = await toggleFavoriteStory(id);
      this.#view.updateFavoriteButton(isFavorite);
    } catch (error) {
      this.#view.showError(`Gagal mengubah status favorit: ${error.message}`);
    }
  }
}
