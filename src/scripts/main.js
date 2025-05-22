import App from "./pages/app";
import "../styles/styles.css";
import { withViewTransition } from "./utils/view-transition.js";

window.addEventListener("hashchange", () => {
  withViewTransition(() => App.renderPage());
});
window.addEventListener("load", () => {
  App.renderPage();

  // Pastilkan DOM siap sebelum inisialisasi push
  if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
        // Tunggu hingga DOM diperbarui oleh App.renderPage()
        requestAnimationFrame(() => {
          initializePush(registration);
        });
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  } else {
    console.warn("Push notification tidak mendukung di browser ini.");
    const subscribeButton = document.getElementById("subscriptionButton");
    if (subscribeButton) subscribeButton.disabled = true;
  }
});

async function initializePush(registration) {
  const subscriptionButton = document.getElementById("subscriptionButton");
  if (!subscriptionButton) {
    console.error("Tombol subscribe tidak ditemukan.");
    return;
  }

  // Periksa status langganan saat ini
  const subscription = await registration.pushManager.getSubscription();
  updateButton(subscription);

  // Tambahkan event listener untuk tombol
  subscriptionButton.addEventListener("click", async () => {
    if (subscriptionButton.classList.contains("subscribed")) {
      // Unsubscribe
      const currentSubscription =
        await registration.pushManager.getSubscription();
      if (currentSubscription) {
        await currentSubscription.unsubscribe();
        updateButton(null);
      }
    } else {
      // Subscribe
      const applicationServerKey = urlBase64ToUint8Array(
        "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
      );
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });
      updateButton(newSubscription);

      // Kirim langgana ke server
      await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(newSubscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  });
}

function updateButton(subscription) {
  const subscriptionButton = document.getElementById("subscriptionButton");
  if (subscription) {
    subscriptionButton.textContent = "UNSUBCRIBE";
    subscriptionButton.classList.add("subscribed");
  } else {
    subscriptionButton.textContent = "SUBSCRIBE";
    subscriptionButton.classList.remove("subscribed");
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
