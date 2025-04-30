const AboutPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return "";
    }

    return `
      <section class="about">
        <h2>Tentang Fora</h2>
        <p>Fora adalah aplikasi berbasis web yang memungkinkan pengguna menemukan, menilai, dan menambahkan tempat makan favorit mereka. Aplikasi ini dikembangkan sebagai bagian dari pembelajaran membangun SPA dengan JavaScript Vanilla dan Webpack.</p>
      </section>
    `;
  },

  async afterRender() {
    // Jika ada interaksi atau animasi setelah render, tambahkan di sini
  },
};

export default AboutPage;
