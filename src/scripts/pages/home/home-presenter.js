// home-presenter.js
import { getAllStories } from "../../data/repository.js";
import Idb from "../../data/idb.js";

export default class HomePresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async loadStories() {
    try {
      const stories = await getAllStories();

      // Simpan data ke IndexedDB
      for (const story of stories) {
        await Idb.putStory(story);
      }

      if (!stories || stories.length === 0) {
        this.#view.showNoStories();
      } else {
        this.#view.showStories(stories);
      }
    } catch (error) {
      console.warn("Gagal fetch dari API. Coba ambil data dari IndexedDB.");
      try {
        const cachedStories = await Idb.getAllStories();

        if (!cachedStories || cachedStories.length === 0) {
          this.#view.showNoStories();
        } else {
          this.#view.showStories(cachedStories);
        }
      } catch (fallbackError) {
        this.#view.showError("Gagal memuat data dari manapun.");
      }
    }
  }
}
