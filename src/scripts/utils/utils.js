export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function sendSubscriptionToServer(subscription) {
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
    return result;
  } catch (e) {
    console.error("Gagal mengirim subscription ke server:", e);
  }
}

export async function unsubscribeFromServer(subscription) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("User belum login, unsubscribe dibatalkan.");
    return;
  }

  try {
    const response = await fetch(
      "https://story-api.dicoding.dev/v1/notifications/subscribe",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      }
    );

    const result = await response.json();
    console.log("Respons unsubscribe dari server:", result);
    return result;
  } catch (e) {
    console.error("Gagal unsubscribe dari server:", e);
  }
}
