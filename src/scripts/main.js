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

  // Hindari menambahkan listener lebih dari satu kali
  if (subscriptionButton.dataset.listenerAttached === "true") return;
  subscriptionButton.dataset.listenerAttached = "true";

  // Periksa status langganan saat ini
  const subscription = await registration.pushManager.getSubscription();
  updateButton(subscription);

  // Tambahkan event listener untuk tombol
  subscriptionButton.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token tidak ditemukan.");
      return;
    }

    if (!subscriptionButton.classList.contains("subscribed")) {
      const applicationServerKey = urlBase64ToUint8Array(
        "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
      );
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });
      updateButton(newSubscription);

      const subscriptionData = {
        endpoint: newSubscription.endpoint,
        keys: {
          p256dh: newSubscription.toJSON().keys.p256dh,
          auth: newSubscription.toJSON().keys.auth,
        },
      };

      await fetch("/notifications/subscribe", {
        method: "POST",
        body: JSON.stringify(newSubscription),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (Notification.permission === "granted") {
        const notif = new Notification("Langganan berhasil", {
          body: "Anda telah berlangganan notifikasi.",
          icon: "/images/logo.png",
          badge: "/images/favicon.png",
          requireInteraction: false,
        });
        setTimeout(() => notif.close(), 5000);
      }
    } else {
      const currentSubscription =
        await registration.pushManager.getSubscription();
      if (currentSubscription) {
        const endpoint = currentSubscription.endpoint;
        await fetch("/notifications/unsubscribe", {
          method: "DELETE",
          header: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ endpoint }),
        });

        await currentSubscription.unsubscribe();
        updateButton(null);

        if (Notification.permission === "granted") {
          const notif = new Notification("Berhasil Unsubscribe", {
            body: "Anda telah berhenti langganan notifikasi.",
            icon: "/images/logo.png",
            badge: "/images/favicon.png",
            requireInteraction: false,
          });
          setTimeout(() => notif.close(), 5000);
        }
      }
    }
  });
}

function updateButton(subscription) {
  const subscriptionButton = document.getElementById("subscriptionButton");
  if (subscription) {
    subscriptionButton.textContent = "UNSUBSCRIBE";
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

export { initializePush };
