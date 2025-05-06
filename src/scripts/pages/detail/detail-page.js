import { getStoryById } from "../../data/repository";
import DetailPresenter from "./detail.presenter";
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
    console.log("Requested Story ID:", id);

    if (!id || !id.startsWith("story-")) {
      const container = document.getElementById("story-container");
      container.innerHTML =
        "<p>ID cerita tidak valid. Harus dimulai dengan 'story-'.</p>";
      return;
    }

    const presenter = new DetailPresenter({ view: this });
    await presenter.loadStory(id);
  },

  showStory(story) {
    const container = document.getElementById("story-container");
    container.innerHTML = `
      <article aria-label="Detail review pengguna">
        <h1>Detail Review</h1>
        <img src="${story.photoUrl}" alt="Foto review oleh ${
      story.name
    }" style="max-width: 300px;" />
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
  },

  showError(message) {
    const container = document.getElementById("story-container");
    container.innerHTML = `<p style="color: red;">${message}</p>`;
  },
};

export default DetailPage;
