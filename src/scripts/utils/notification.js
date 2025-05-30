import { CONFIG } from "../config";

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

async function subscribeToPushNotification(registration) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token tidak ditemukan.");
      return null;
    }

    await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    console.log("Push subscription successful");

    if (Notification.permission === "granted") {
      const notif = new Notification("Langganan berhasil", {
        body: "Anda telah berlangganan notifikasi.",
        icon: "/images/logo.png",
        badge: "/images/favicon.png",
        requireInteraction: false,
      });
      setTimeout(() => notif.close(), 5000);
    }

    return subscription;
  } catch (error) {
    console.error("Push subscription failed", error);
    return null;
  }
}

async function unsubscribeFromPushNotification(registration) {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      console.log("No subscription to unsubscribe");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token tidak ditemukan.");
      return false;
    }

    await fetch(`${CONFIG.BASE_URL}/notifications/unsubscribe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    await subscription.unsubscribe();
    console.log("Push unsubscription successful");

    if (Notification.permission === "granted") {
      const notif = new Notification("Berhasil Unsubscribe", {
        body: "Anda telah berhenti langganan notifikasi.",
        icon: "/images/logo.png",
        badge: "/images/favicon.png",
        requireInteraction: false,
      });
      setTimeout(() => notif.close(), 5000);
    }

    return true;
  } catch (error) {
    console.error("Push unsubscription failed", error);
    return false;
  }
}

function updateButton(subscription) {
  const subscriptionButton = document.getElementById("subscriptionButton");
  if (!subscriptionButton) {
    console.error("Tombol subscribe tidak ditemukan.");
    return;
  }

  if (subscription) {
    subscriptionButton.textContent = "UNSUBSCRIBE";
    subscriptionButton.classList.add("subscribed");
  } else {
    subscriptionButton.textContent = "SUBSCRIBE";
    subscriptionButton.classList.remove("subscribed");
  }
}

async function initializePush(registration) {
  const subscriptionButton = document.getElementById("subscriptionButton");
  if (!subscriptionButton) {
    console.error("Tombol subscribe tidak ditemukan.");
    return;
  }

  if (subscriptionButton.dataset.listenerAttached === "true") return;
  subscriptionButton.dataset.listenerAttached = "true";

  let subscription = await registration.pushManager.getSubscription();
  updateButton(subscription);

  subscriptionButton.addEventListener("click", async () => {
    if (subscriptionButton.classList.contains("subscribed")) {
      const success = await unsubscribeFromPushNotification(registration);
      if (success) {
        subscription = null;
        updateButton(null);
      }
    } else {
      subscription = await subscribeToPushNotification(registration);
      if (subscription) {
        updateButton(subscription);
      }
    }
  });
}

export {
  initializePush,
  subscribeToPushNotification,
  unsubscribeFromPushNotification,
};
