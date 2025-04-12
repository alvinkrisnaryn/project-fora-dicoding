const Navbar = {
  async render() {
    return `
      <nav class="navbar">
        <a href="#/home">Home</a>
        <a href="#/about">About</a>
        <a href="#/detail/1">Detail Restoran</a>
      </nav>
    `;
  }
};

export default Navbar;
