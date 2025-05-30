import { initializePush } from "../../utils/notification.js";

const Navbar = {
  async render() {
    return `
      <nav class="navbar" role="navigation" aria-label="Navigasi Utama">
        <ul class="navbar-list">
          <li><a href="#/home">Home</a></li>
          <li><a href="#/add">Add</a></li>
          <li><a href="#/about">About</a></li>
        </ul>
        <button id="subscriptionButton">SUBSCRIBE</button>
        <button id="logoutButton" class=""logout-button style="width: 44px; height: 44px; cursor: pointer; background-color: red">Logout</button>
      </nav>
    `;
  },

  async afterRender() {
    const logoutBtn = document.getElementById("logoutButton");

    if (!localStorage.getItem("token")) {
      logoutBtn.style.display = "none"; // Sembunyikan kalau belum login
    } else {
      logoutBtn.style.display = "inline-block";
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        window.location.href = "#/login";
      });
    }

    // Tambahkan ini agar tombol subscription siap digunakan
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.ready;
      initializePush(registration);
    }
  },
};

export default Navbar;
