import UrlParser from "../routes/url-parser.js";
import routes from "../routes/routes.js";
import Navbar from "../components/navbar/navbar.js";

const App = {
  previousPage: null,
  lastRoute: null,

  async renderPage() {
    const token = localStorage.getItem("token");
    const url = UrlParser.parseActiveUrl();

    // Ambil elemen-elemen yang dibutuhkan
    const content = document.querySelector("#main-content");
    const navbar = document.querySelector("#navbar");
    if (!content) {
      console.error("Element #main-content not found");
      return;
    }

    const routeKey = UrlParser.parseActiveUrlWithCombiner(); // untuk cocokkan ke routes
    console.log("Route key:", routeKey);
    if (routeKey === this.lastRoute && !token) {
      console.log("Skipping render: Same route as lastRoute");
      return;
    }
    this.lastRoute = routeKey;

    // Daftar rute yang memerlukan autentikasi
    const protectedRoutes = ["/home", "/add", "/about", "/detail/:id"];
    const isProtectedRoute =
      protectedRoutes.includes(routeKey) || routeKey.startsWith("/detail/");
    const isAuthPage = url.resource === "login" || url.resource === "register";

    // Alihkan ke /home jika sudah login dan mencoba akses login/register
    if (isAuthPage && token) {
      window.location.hash = "/home";
      await this.renderPage();
      return;
    }

    // Periksa autentikasi untuk rute yang dilindungi
    if (isProtectedRoute && !token) {
      window.location.hash = "/login";
      await this.renderPage();
      return;
    }

    const page = routes[routeKey] || routes["/home"]; // Default ke halaman utama jika rute
    console.log("Selected page:", page);

    // 🔴 Jalankan beforeLeave() halaman sebelumnya (kalau ada)
    if (this.previousPage?.beforeLeave) {
      await this.previousPage.beforeLeave();
    }

    // kelola navbar
    if (!isAuthPage && navbar) {
      navbar.innerHTML = await Navbar.render();
      await Navbar.afterRender();
    } else {
      if (navbar) navbar.innerHTML = ""; // sembunyikan navbar di halaman login/register
    }

    content.innerHTML = ""; // Kosongkan konten sebelum render
    try {
      content.innerHTML = await page.render();
      await page.afterRender?.();
    } catch (error) {
      content.innerHTML = "<p>Error rendering page</p>";
    }

    this.previousPage = page;
  },
};

export default App;
