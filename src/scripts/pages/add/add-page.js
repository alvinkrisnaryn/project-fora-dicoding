import { postStoryWithLocation } from "../../data/repository";
import { initCamera, captureImage, stopCamera } from "../../utils/camera";

const AddPage = {
  async render() {
    return `
      <section class="add-story">
        <h2>Tambah Review</h2>
        <form id="storyForm">
          <textarea id="description" placeholder="Tulis review kamu di sini..." required></textarea>
          <input type="file" id="photo" accept="image/*" />

          <div class="camera-section">
              <video id="camera" autoplay></video>
              <canvas id="snapshot" style="display: none;"></canvas>
              <button type="button" id="captureButton">Ambil Foto</button>
          </div>

          <div id="image-preview" style="margin-top:1em;">
            <h4>Preview Gambar:</h4>
            <img id="preview-img" src="" alt="Preview" style="max-width: 100%; display: none;" />
          </div>

          <button type="submit">Kirim</button>
        </form>
        <p id="submit-message"></p>

        <div id="map" style="height: 300px; margin-top: 1em;"></div>
        <input type="hidden" id="lat">
        <input type="hidden" id="lon">

      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById("storyForm");
    const message = document.getElementById("submit-message");

    // ⬇️ Inisialisasi kamera saat halaman siap
    await initCamera("camera");

    const fileInput = document.getElementById("photo");
    const captureButton = document.getElementById("captureButton");

    // Jika user ambil foto dari kamera, reset file upload
    captureButton.addEventListener("click", async () => {
      const photoBlob = await captureImage("camera", "snapshot");
      window.capturedPhotoBlob = photoBlob;

      // Kosongkan file input
      fileInput.value = "";

      const previewImg = document.getElementById("preview-img");
      previewImg.src = URL.createObjectURL(photoBlob);
      previewImg.style.display = "block";
    });

    // Jika user upload file, reset hasil kamera
    fileInput.addEventListener("change", () => {
      window.capturedPhotoBlob = null;
      const file = fileInput.files[0];
      const previewImg = document.getElementById("preview-img");

      if (file) {
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = "block";
      } else {
        previewImg.style.display = "none";
      }
    });

    // ⬇️ Tangani submit form
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document.getElementById("description").value;
      const filePhoto = document.getElementById("photo").files[0];
      const cameraPhoto = window.capturedPhotoBlob;

      // ⛔ Validasi jika tidak ada gambar dari file maupun kamera
      if (!filePhoto && !cameraPhoto) {
        message.innerText = "Silakan upload gambar atau ambil dari kamera.";
        return;
      }

      // ✅ Validasi jika dua-duanya dipakai, minta pilih salah satu
      if (filePhoto && cameraPhoto) {
        message.innerText =
          "Pilih salah satu: upload file ATAU ambil dari kamera.";
        return;
      }

      try {
        await postStory(description, filePhoto || cameraPhoto);
        message.innerText = "Berhasil mengirim review!";

        stopCamera();

        setTimeout(() => (window.location.href = "#/home"), 1500);
      } catch (error) {
        message.innerText = `Gagal mengirim review: ${error.message}`;
      }

      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;

      if (!lat || !lon) {
        message.innerText = "Silakan pilih lokasi pada peta.";
        return;
      }
      if (!filePhoto && !cameraPhoto) {
        message.innerText = "Silakan unggah gambar atau gunakan kamera.";
        return;
      }

      // ✅ INI DIA: Buat FormData sebelum digunakan
      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", filePhoto || cameraPhoto);
      formData.append("lat", lat);
      formData.append("lon", lon);

      try {
        await postStoryWithLocation(formData); // kamu bisa buat fungsi baru atau modifikasi yang lama
        message.innerText = "Berhasil mengirim review!";
        stopCamera();
        setTimeout(() => (window.location.href = "#/home"), 1500);
      } catch (error) {
        message.innerText = `Gagal mengirim review: ${error.message}`;
      }
    });

    // Inisialisasi peta
    const map = L.map("map").setView([-6.2, 106.816666], 13); // default: Jakarta

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker;

    // Tangkap klik di peta
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      // Tampilkan marker
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }

      // Simpan ke input hidden
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lng;
    });
  },

  async beforeLeave() {
    // Fungsi ini akan dipanggil sebelum pindah halaman
    const { stopCamera } = await import("../../utils/camera.js");
    stopCamera();
  },
};

export default AddPage;
