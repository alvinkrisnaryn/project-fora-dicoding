import { getStoryById } from "../../data/repository";
import UrlParser from "../../routes/url-parser";

const DetailPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Access denied to /detail: No token found");
      window.location.hash = "#/login";
      return "";
    }
    return `
      <section class="story-detail">
        <div id="story-container">Loading...</div>
      </section>
    `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrl();
    const id = url.id;
    console.log("Requested Story ID:", id); // Log ID

    if (!id || !id.startsWith("story-")) {
      const container = document.getElementById("story-container");
      container.innerHTML =
        "<p>ID cerita tidak valid. Harus dimulai dengan 'story-'.</p>";
      return;
    }

    try {
      const story = await getStoryById(id);
      const container = document.getElementById("story-container");

      if (!story) {
        container.innerHTML =
          "<p>Cerita tidak ditemukan. Pastikan ID cerita valid atau coba lagi nanti.</p>";
        return;
      }

      container.innerHTML = `
        <article aria-label="Detail review pengguna">
          <h1>Detail Review</h1>
          <img 
            src="${story.photoUrl}" 
            alt="Foto review oleh ${story.name}" 
            style="max-width: 300px;" 
          />
          <h2>${story.name}</h2>
          <p><strong>Deskripsi:</strong> ${story.description}</p>
          <p><strong>Dibuat pada:</strong> ${new Date(
            story.createdAt
          ).toLocaleString()}</p>
          ${
            story.lat && story.lon
              ? `
              <p><strong>Lokasi:</strong> ${story.lat}, ${story.lon}</p>
              <div id="map-detail" style="height: 300px; margin-top: 1em;"></div>
            `
              : `<p><em>Lokasi tidak tersedia</em></p>`
          }
        </article>
      `;

      // Render peta jika ada koordinat
      if (story.lat && story.lon) {
        const map = L.map("map-detail").setView([story.lat, story.lon], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup("Lokasi review ini")
          .openPopup();
      }
    } catch (error) {
      console.error("Error loading story:", error);
      const container = document.getElementById("story-container");
      container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  },
};

export default DetailPage;
