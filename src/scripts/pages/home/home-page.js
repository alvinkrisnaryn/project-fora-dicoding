import HomePresenter from "./home-presenter.js"; // Import Presenter

const HomePage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("#/login"); // Gunakan replace untuk menghindari history stack
      return ""; // Jangan tampilkan apa pun, biarkan App.renderPage menangani
    }

    return `
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <section class="content">
        <h1>Selamat datang di Fora</h1>
        <h2>Review terbaru</h2>
        <p>Ini adalah halaman beranda dengan daftar tempat makan</p>
        <div id="stories" aria-label="Daftar review tempat makan">
          <div id="loading" style="text-align: center; padding: 20px;">
            <p>Memuat review...</p>
          </div>
        </div>
        <h2>Peta Lokasi Review</h2>
        <div id="map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Inisialisasi peta
    this.map = L.map("map").setView([-6.2088, 106.8456], 10); // Default ke Jakarta
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Inisialisasi Presenter dengan View (this)
    const presenter = new HomePresenter({ view: this });
    presenter.loadStories(); // Panggil Presenter untuk mengambil data

    // Event listener untuk tombol hapus
    document
      .querySelector("#stories")
      .addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-btn")) {
          const id = event.target.getAttribute("data-id");

          const Idb = (await import("../../data/idb.js")).default;
          await Idb.deleteStory(id);

          // Hapus elemen dari DOM
          const card = event.target.closest(".story-card");
          if (card) card.remove();
        }
      });
  },

  // Fungsi untuk menampilkan daftar stories
  showStories(stories) {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML = ""; // Kosongkan dulu
    const loadingElement = document.querySelector("#loading");
    if (loadingElement) loadingElement.remove(); // Hapus indikator loading

    // Reset marker di peta
    if (this.map) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
    }

    // Batasi ke 10 story pertama jika diperlukan
    const limitedStories = stories.slice(0, 10);

    limitedStories.forEach((story) => {
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
          <button class="delete-btn" data-id="${story.id}">Hapus</button>
        </article>
      `;

      // Tambahkan marker ke peta jika lat dan lon tersedia
      if (story.lat && story.lon && this.map) {
        L.marker([story.lat, story.lon])
          .addTo(this.map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }

      // Tambahkan marker ke peta jika lat dan lon tersedia
      if (story.lat && story.lon && this.map) {
        L.marker([story.lat, story.lon])
          .addTo(this.map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });

    // Atur ulang posisi peta berdasarkan marker yang valid
    const validMarkers = limitedStories.filter(
      (story) => story.lat && story.lon
    );
    if (validMarkers.length > 0) {
      const bounds = L.latLngBounds(
        validMarkers.map((story) => [story.lat, story.lon])
      );
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 }); // Batasi zoom lebih ketat
    } else {
      this.map.setView([-6.2088, 106.8456], 10); // Kembali ke default jika tidak ada marker
    }
  },

  // Fungsi untuk menampilkan pesan jika tidak ada stories
  showNoStories() {
    const storiesContainer = document.querySelector("#stories");
    const loadingElement = document.querySelector("#loading");
    if (loadingElement) loadingElement.remove(); // Hapus indikator loading
    storiesContainer.innerHTML = "<p>Belum ada review</p>";
  },

  // Fungsi untuk menampilkan pesan error
  showError(message) {
    const storiesContainer = document.querySelector("#stories");
    const loadingElement = document.querySelector("#loading");
    if (loadingElement) loadingElement.remove(); // Hapus indikator loading
    storiesContainer.innerHTML = `<p style="color:red;">Gagal memuat review: ${message}</p>`;
  },
};

export default HomePage;
