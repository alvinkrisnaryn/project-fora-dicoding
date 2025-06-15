import { getFavoriteStories } from "../../data/repository.js";
import { createReviewCard } from "../../components/review-card/review-card.js";

const FavoritesPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Access denied to /favorites: No token found");
      window.location.hash = "#/login";
      return "";
    }
    return `
      <section class="favorites-section">
        <h1>Story Favorit</h1>
        <div id="favorites-container" class="favorites-list">Memuat story favorit...</div>
      </section>
    `;
  },

  async afterRender() {
    try {
      const container = document.getElementById("favorites-container");
      const stories = await getFavoriteStories();

      if (stories.length === 0) {
        container.innerHTML =
          "<p>Belum ada story favorit. Tambahkan dari halaman detail!</p>";
        return;
      }

      container.innerHTML = "";
      stories.forEach((story) => {
        const reviewCard = createReviewCard(story);
        container.appendChild(reviewCard);
      });
    } catch (error) {
      console.error("Error loading favorite stories:", error);
      document.getElementById(
        "favorites-container"
      ).innerHTML = `<p style="color: red;">Gagal memuat story favorit: ${error.message}</p>`;
    }
  },
};

export default FavoritesPage;
