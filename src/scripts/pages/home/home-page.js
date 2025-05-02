// home-page.js
import HomePresenter from "./home-presenter.js"; // Import Presenter

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

    // Inisialisasi Presenter dengan View (this)
    const presenter = new HomePresenter({ view: this });
    presenter.loadStories(); // Panggil Presenter untuk mengambil data
  },

  // Fungsi untuk menampilkan daftar stories
  showStories(stories) {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML = ""; // Kosongkan dulu
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
          <p><small>Dibuat pada: ${new Date(story.createdAt).toLocaleString(
            "id-ID",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}</small></p>
        </article>
      `;
    });
  },

  // Fungsi untuk menampilkan pesan jika tidak ada stories
  showNoStories() {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML = "<p>Belum ada review</p>";
  },

  // Fungsi untuk menampilkan pesan error
  showError(message) {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML = `<p style="color:red;">Gagal memuat review: ${message}</p>`;
  },
};

export default HomePage;
