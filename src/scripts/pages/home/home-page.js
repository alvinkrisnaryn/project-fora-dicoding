const HomePage = {
  async render() {
    return `
      <section class="home">
        <h1>Selamat datang di Fora</h1>
        <p>Ini adalah halaman beranda dengan daftar tempat makan (dummy)</p>
      </section>
    `;
  },

  async afterRender() {
    // logika setelah render, jika ada
  },
};

export default HomePage;
