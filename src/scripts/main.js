import App from "./pages/app";
import "../styles/styles.css";

window.addEventListener("hashchange", () => App.renderPage());
window.addEventListener("load", () => App.renderPage());

