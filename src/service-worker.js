self.addEventListener("push", (event) => {
  let data;
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = { body: event.data ? event.data.text() : 'Ada pembaruan baru di Fora!' };
  }

  const options = {
    body: data.body || "Ada pembaruan baru di Fora!",
    icon: "./images/logo.png",
    badge: "./images/favicon.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Fora Notification",
      options
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notifification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
