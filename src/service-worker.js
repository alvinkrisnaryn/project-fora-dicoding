const CACHE_NAME = "fora-cache-v1";
const ASSETS_TO_CAHCE = [
  "/",
  "/index.html",
  "/app.bundle.js",
  "/app.css",
  "https://upkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://upkg.com/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CAHCE))
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener("push", (event) => {
  console.log("[SW] Push received, raw data:", event.data?.text());

  let data = {
    title: "Notifikasi Baru",
    body: "Ada pesan baru untukmu!",
  };

  try {
    const incoming = event.data?.json();
    data.title = incoming.title || data.title;
    data.body = incoming.body || data.body;
  } catch (error) {
    console.warn("Data push bukan JSON valid, menggunakan default:", error);
    data.body = event.data?.text() || data.body;
  }

  const options = {
    body: data.body,
    icon: "/icon.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
