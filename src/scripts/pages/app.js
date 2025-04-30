import UrlParser from "../routes/url-parser.js";
import routes from "../routes/routes.js";
import Navbar from "../components/navbar/navbar.js";

const App = {
  previousPage: null,
  lastRoute: null,

  async renderPage() {
    const token = localStorage.getItem("token");
    console.log("Token exists:", !!token);
    const url = UrlParser.parseActiveUrl();
    const content = document.querySelector("#main-content");
    const navbar = document.querySelector("#navbar");

    const routeKey = UrlParser.parseActiveUrlWithCombiner(); // untuk cocokkan ke routes
    if (routeKey === this.lastRoute) {
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
      console.log("Redirecting to /home: Already logged in, token exists");
      window.location.hash = '#/home';
      return;
    }

    // Periksa autentikasi untuk rute yang dilindungi
    if (isProtectedRoute && !token) {
      console.log("Redirecting to login: No token for protected route", routeKey);
      window.location.hash = "#/login";
      return;
    }

    const page = routes[routeKey] || routes["/"]; // Default ke halaman utama jika rute

    // 🔴 Jalankan beforeLeave() halaman sebelumnya (kalau ada)
    if (this.previousPage?.beforeLeave) {
      await this.previousPage.beforeLeave();
    }

    // kelola navbar
    if (!isAuthPage && navbar) {
      navbar.innerHTML = await Navbar.render();
      await Navbar.afterRender();
    } else {
      navbar.innerHTML = ""; // sembunyikan navbar di halaman login/register
    }
    content.innerHTML = ""; // Kosongkan konten sebelum render
    try {
      content.innerHTML = await page.render();
      await page.afterRender?.();
      console.log("After render executed for route:", routeKey);
    } catch (error) {
      console.error("Render error for route:", routeKey, ":", error);
      content.innerHTML = "<p>Error rendering page</p>";
    }

    this.previousPage = page;
  },
};

export default App;
