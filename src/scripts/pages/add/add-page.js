import { postStoryWithLocation } from "../../data/repository";
import { initCamera, captureImage, stopCamera } from "../../utils/camera";

const AddPage = {
  async render() {
    // Periksa autentikasi
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

    // Periksa autentikasi (opsional, untuk keamanan tambahan)
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    const form = document.getElementById("storyForm");
    const message = document.getElementById("submit-message");

    // Inisialisasi kamera saat halaman siap
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

      try {
        await postStoryWithLocation(formData);
        message.innerText = "Berhasil mengirim review!";
        stopCamera(); // Hentikan kamera sebelum navigasi
        const previewImg = document.getElementById("preview-img");
        if (previewImg.src) {
          URL.revokeObjectURL(previewImg.src); // Bersihkan URL
          previewImg.src = "";
          previewImg.style.display = "none";
        }
        setTimeout(() => {
          window.location.href = "#/home";
        }, 1500);
      } catch (error) {
        message.innerText = `Gagal mengirim review: ${error.message}`;
      }
    });

    // tambahkan event listener untuk hashchange
    const handleHashChange = () => {
      stopCamera();
    };
    window.addEventListener("hashchange", handleHashChange);

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
