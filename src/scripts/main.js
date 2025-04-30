import App from "./pages/app";
import "../styles/styles.css";
import { withViewTransition } from "./utils/view-transition.js";

window.addEventListener("hashchange", () => {
  withViewTransition(() => App.renderPage());
});
window.addEventListener("load", () => App.renderPage());
