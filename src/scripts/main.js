import App from "./pages/app";
import "../styles/styles.css";
import { withViewTransition } from "./utils/view-transition.js";

window.addEventListener("hashchange", () => {
  withViewTransition(() => App.renderPage());
});
window.addEventListener("load", () => {
  App.renderPage();

  // Registrasi Service Worket untuk Push Notification
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }
});
