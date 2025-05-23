import { CONFIG } from "../config";

export async function subscribeToPushNotification() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });

    await fetch(`${CONFIG.BASE_URL}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
      },
      body: JSON.stringify(subscription),
    });

    console.log("Push subscription successfully");
  } catch (error) {
    console.error("Push subscription failed", error);
  }
}

