const Navbar = {
  async render() {
    return `
      <nav class="navbar">
        <a href="#/home">Home</a>
        <a href="#/about">About</a>
        <button id="logoutButton" style="margin-left:auto;">Logout</button>
      </nav>
    `;
  },

  async afterRender() {
    const logoutBtn = document.getElementById('logoutButton');

    if (!localStorage.getItem('token')) {
      logoutBtn.style.display = 'none'; // Sembunyikan kalau belum login
    } else {
      logoutBtn.style.display = 'inline-block';
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        window.location.href = '#/login';
      });
    }
  },
};

export default Navbar;
