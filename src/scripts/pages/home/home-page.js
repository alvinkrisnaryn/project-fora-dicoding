import { getAllStories } from "../../data/repository.js";

const HomePage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "#/login";
      return "<p>Redirectering...</p>";
    }

    return `
      <section class="content">
        <h1>Selamat datang di Fora</h1>
        <h2>Review terbaru</h2>
        <p>Ini adalah halaman beranda dengan daftar tempat makan</p>
        <div id="stories"></div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const storiesContainer = document.querySelector("#stories");
    try {
      const stories = await getAllStories();

      if (!stories || stories.length === 0) {
        storiesContainer.innerHTML = "<p>Belum ada review</p>";
        return;
      }

      stories.forEach((story) => {
        storiesContainer.innerHTML += `
          <div class="story-card">
            <a href="#/detail/${story.id}">
              <img src="${story.photoUrl}" alt="${story.name}" width="200">
              <h3>${story.name}</h3>
            </a>
            <p>${story.description}</p>
          </div>
        `;
      });
    } catch (error) {
      storiesContainer.innerHTML =
        '<p style="color:red;">Gagal memuat review: ${error.message}</p>';
    }
  },
};

export default HomePage;
