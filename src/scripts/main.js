import App from "./pages/app";
import '../styles/styles.css';

window.addEventListener("load", () => App.renderPage());
window.addEventListener("hashchange", () => App.renderPage());
