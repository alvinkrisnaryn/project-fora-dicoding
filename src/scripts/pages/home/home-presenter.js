import { getAllStories } from "../../data/repository.js";
import { subscribeToPushNotification } from "../../utils/notification.js";

export default class HomePresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async init() {
    await this.loadStories();
    await subscribeToPushNotification();
  }

  async loadStories() {
    try {
      const stories = await getAllStories();
      if (!stories || stories.length === 0) {
        this.#view.showNoStories();
      } else {
        this.#view.showStories(stories);
      }
    } catch (error) {
      this.#view.showError(error.message);
    }
  }
}
