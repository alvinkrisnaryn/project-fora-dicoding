import App from "./pages/app";
import "../styles/styles.css";
import { withViewTransition } from "./utils/view-transition.js";
import initNotification from "./utils/notification.js";

window.addEventListener("hashchange", () => {
  withViewTransition(() => App.renderPage());
});
window.addEventListener("load", () => {
  App.renderPage();
  initNotification();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("[PWA] Service worker registered:", registration);
      })
      .catch((error) => {
        console.error("[PWA] Service worker registration failed:", error);
      });
  });
}

// Tombol install manual
let deferredPrompt;
const installBtn = document.createElement("button");
installBtn.textContent = "Install Aplikasi";
installBtn.style.position = "fixed";
installBtn.style.bottom = "20px";
installBtn.style.right = "20px";
installBtn.style.padding = "10px 16px";
installBtn.style.backgroundColor = "#0f172a";
installBtn.style.color = "#fff";
installBtn.style.border = "none";
installBtn.style.borderRadius = "8px";
installBtn.style.cursor = "pointer";
installBtn.style.zIndex = "1000";
installBtn.style.display = "none";
document.body.appendChild(installBtn);

// Tangkap event beforeinstallprompt
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("[PWA] beforeinstallprompt fired");
  console.log("[PWA] Event:", e);
  e.preventDefault(); // Cegah prompt otomatis
  deferredPrompt = e;
  installBtn.style.display = "block"; // Tampilkan tombol
});

// Saat tombol diklik
installBtn.addEventListener("click", async () => {
  installBtn.style.display = "none"; // Sembunyikan tombol
  if (deferredPrompt) {
    deferredPrompt.prompt(); // Tampilkan prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install: ${outcome}`);
    deferredPrompt = null;
  }
});
