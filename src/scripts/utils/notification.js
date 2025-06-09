import { urlBase64ToUint8Array } from "./utils.js";

async function initNotification() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging tidak didukung di browser ini.");
    return;
  }

  try {
    const swResponse = await fetch("/service-worker.js");
    if (!swResponse.ok) {
      throw new Error("Service worker tidak ditemukan atau tidak valid.");
    }

    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log("Service worker terdaftar dengan scope:", registration.scope);

    const readyRegistration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Izin notifikasi ditolak.");
      return;
    }

    const subscription = await readyRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
      ),
    });

    console.log("User is subscribed:", subscription);
    await sendSubcriptionToServer(subscription);
  } catch (error) {
    console.error("Gagal menginisialisasi notifikasi:", error);
  }
}

async function sendSubcriptionToServer(subscription) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("User belum login, langganan notifikasi dibatalkan.");
    return;
  }

  const body = {
    endpoint: subscription.endpoint,
    keys: subscription.toJSON().keys,
  };

  try {
    const response = await fetch(
      "https://story-api.dicoding.dev/v1/notifications/subscribe",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    console.log("Notifikasi berhasil disubscribe ke server:", result);
  } catch (err) {
    console.error("Gagal mengirim data subscription ke server:", err);
  }
}

export default initNotification;
