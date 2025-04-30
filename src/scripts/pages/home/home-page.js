import { getAllStories } from "../../data/repository.js";

const HomePage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("#/login"); // Gunakan replace untuk menghindari history stack
      return ""; // Jangan tampilkan apa pun, biarkan App.renderPage menangani
    }

    return `
      <section class="content">
        <h1>Selamat datang di Fora</h1>
        <h2>Review terbaru</h2>
        <p>Ini adalah halaman beranda dengan daftar tempat makan</p>
        <div id="stories" aria-label="Daftar review tempat makan"></div>
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

      storiesContainer.innerHTML = ""; // Kosongkan dulu untuk menghindari duplikasi
      stories.forEach((story) => {
        storiesContainer.innerHTML += `
          <article class="story-card">
            <a href="#/detail/${story.id}">
              <img 
                src="${story.photoUrl}" 
                alt="Foto review oleh ${story.name}" 
                width="200"
              >
              <h3>${story.name}</h3>
            </a>
            <p>${story.description}</p>
          </article>
        `;
      });
    } catch (error) {
      storiesContainer.innerHTML =
        '<p style="color:red;">Gagal memuat review: ${error.message}</p>';
    }
  },
};

export default HomePage;
