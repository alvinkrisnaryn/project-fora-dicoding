import UrlParser from "../routes/url-parser.js";
import routes from "../routes/routes.js";
import Navbar from "../components/navbar/navbar.js";

const App = {
  previousPage: null,

  async renderPage() {
    const url = UrlParser.parseActiveUrl();
    const content = document.querySelector("#main-content");
    const navbar = document.querySelector("#navbar");

    const routeKey = UrlParser.parseActiveUrlWithCombiner(); // untuk cocokkan ke routes

    const page = routes[routeKey];

    const isAuthPage = url.resource === "login" || url.resource === "register";

    // 🔴 Jalankan beforeLeave() halaman sebelumnya (kalau ada)
    if (this.previousPage?.beforeLeave) {
      await this.previousPage.beforeLeave();
    }

    if (!isAuthPage && navbar) {
      navbar.innerHTML = await Navbar.render();
      await Navbar.afterRender();
    } else {
      navbar.innerHTML = ""; // sembunyikan navbar di halaman login/register
    }

    content.innerHTML = await page.render();
    await page.afterRender?.();

    this.previousPage = page;
  },
};

export default App;
