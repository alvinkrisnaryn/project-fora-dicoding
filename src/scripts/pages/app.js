import UrlParser from "../routes/url-parser.js";
import routes from "../routes/routes.js";
import Navbar from "../components/navbar/navbar.js";

const App = {
  async renderPage() {
    const navbar = document.querySelector('#navbar');
    if (navbar) navbar.innerHTML = await Navbar.render();

    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    const content = document.querySelector("#main-content");
    content.innerHTML = await page.render();
    await page.afterRender?.();
  },
};

export default App;
