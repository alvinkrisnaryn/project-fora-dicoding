const Navbar = {
  async render() {
    return `
      <nav class="navbar" role="navigation" aria-label="Navigasi Utama">
        <ul class="navbar-list">
          <li><a href="#/home">Home</a></li>
          <li><a href="#/about">About</a></li>
        </ul>
        <button id="logoutButton" class=""logout-button>Logout</button>
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
  },
};

export default Navbar;
