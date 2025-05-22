self.addEventListener("push", function (event) {
  let data;
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.warn("Data push bukan JSON valid, menggunakan default:", error);
    data = {
      title: "Notifikasi Fora",
      body: event.data ? event.data.text() : "Ada notifikasi baru!",
    };
  }
  const title = data.title || "Notifikasi Fora";
  const options = {
    body: data.body || "Ada notifikasi baru!",
    icon: "./images/logo.png",
    badge: "./images/favicon.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/index.html"));
});
