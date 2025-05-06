import AddPresenter from "./add-presenter.js";
import { initCamera, captureImage, stopCamera } from "../../utils/camera";

const AddPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return "";
    }

    return `
      <section class="add-story">
        <h2>Tambah Review</h2>
        <form id="storyForm">
          <label for="description">Deskripsi Review</label>
          <textarea id="description" placeholder="Tulis review kamu di sini..." required></textarea>
          
          <label for="photo">Unggah Gambar (opsional jika tidak pakai kamera)</label>
          <input type="file" id="photo" accept="image/*" aria-describedby="photo-desc" />
          <p id="photo-desc" class="visually-hidden">Pilih satu gambar dari file atau gunakan kamera</p>

          <div class="camera-section">
              <video id="camera" autoplay aria-label>Tampilkan kamera langsung</video>
              <canvas id="snapshot" style="display: none;"></canvas>
              <button type="button" id="captureButton" aria-label="Ambil foto dari kamera">Ambil Foto</button>
          </div>

          <div id="image-preview" style="margin-top:1em;">
            <h4>Preview Gambar:</h4>
            <img id="preview-img" src="" alt="Preview gambar hasil kamera atau upload" style="max-width: 100%; display: none;" />
          </div>

          <button type="submit">Kirim</button>
        </form>
        <p id="submit-message"></p>

        <div id="map" style="height: 300px; margin-top: 1em;" aria-label="Peta lokasi"></div>
        
        <input type="hidden" id="lat" aria-describedby="latlon-desc">
        <input type="hidden" id="lon" aria-describedby="latlon-desc">
        <p id="latlon-desc" class="visually-hidden">Klik pada peta untuk memilih lokasi review</p>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    const form = document.getElementById("storyForm");
    const message = document.getElementById("submit-message");

    try {
      await initCamera("camera");
    } catch (error) {
      console.warn("Failed to initialize camera:", error);
      if (message)
        message.innerText =
          "Gagal menginisialisasi kamera. Silahkan unggah gambar secara manual.";
    }

    const fileInput = document.getElementById("photo");
    const captureButton = document.getElementById("captureButton");

    // Jika user ambil foto dari kamera, reset file upload
    captureButton.addEventListener("click", async () => {
      try {
        const photoBlob = await captureImage("camera", "snapshot");
        window.capturedPhotoBlob = photoBlob;
        fileInput.value = "";
        const previewImg = document.getElementById("preview-img");
        previewImg.src = URL.createObjectURL(photoBlob);
        previewImg.style.display = "block";
      } catch (error) {
        console.error("Error capturing image:", error);
        message.innerText = "Gagal mengambil foto dari kamera.";
      }
    });

    // Jika user upload file, reset hasil kamera
    fileInput.addEventListener("change", () => {
      window.capturedPhotoBlob = null;
      const file = fileInput.files[0];
      const previewImg = document.getElementById("preview-img");
      if (previewImg) {
        if (file) {
          previewImg.src = URL.createObjectURL(file);
          previewImg.style.display = "block";
        } else {
          preview.style.display = "none";
        }
      }
    });

    const presenter = new AddPresenter({ view: this });

    const cleanup = async () => {
      try {
        const previewImg = document.getElementById("preview-img");
        if (previewImg && previewImg.src) {
          URL.revokeObjectURL(previewImg.src);
          previewImg.src = "";
          previewImg.style.display = "none";
        }
      } catch (error) {
        console.warn("Error during cleanup:", error);
      }
    };

    // Tangani submit form
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document.getElementById("description").value;
      const filePhoto = document.getElementById("photo").files[0];
      const cameraPhoto = window.capturedPhotoBlob;
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;

      // Validasi input
      if (!lat || !lon) {
        message.innerText = "Silakan pilih lokasi pada peta.";
        return;
      }
      if (!filePhoto && !cameraPhoto) {
        message.innerText = "Silakan unggah gambar atau gunakan kamera.";
        return;
      }
      if (filePhoto && cameraPhoto) {
        message.innerText =
          "Pilih salah satu: upload file ATAU ambil dari kamera.";
        return;
      }

      // Buat FormData
      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", filePhoto || cameraPhoto);
      formData.append("lat", lat);
      formData.append("lon", lon);

      await presenter.submitStory(formData, cleanup);
    });

    // tambahkan event listener untuk hashchange
    const handleHashChange = () => {
      try {
        stopCamera();
      } catch (error) {
        console.warn("Error stopping camera on hashchange:", error);
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    // Inisialisasi peta
    const map = L.map("map").setView([-6.2, 106.816666], 13); // default: Jakarta
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lng;
    });

    this.showSuccess = (messageText) => {
      if (message) {
        message.innerText = messageText;
      } else {
        console.error("Message element not found");
      }
    };

    this.showError = (messageText) => {
      if (message) {
        message.innerText = messageText;
      } else {
        console.error("Message element not found");
      }
    };
  },

  async beforeLeave() {
    try {
      stopCamera();
    } catch (error) {
      console.warn("Error stopping camera on beforeLeave:", error);
    }
  },
};

export default AddPage;
