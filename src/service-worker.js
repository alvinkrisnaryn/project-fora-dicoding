importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = "fora-cache-v10";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/app.bundle.js",
  "/app.css",
  "/images/icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js ",
];

self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching assets:", ASSETS_TO_CACHE);
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.error("[SW] Error caching assets:", err);
        throw err;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          console.log("[SW] Fetch from cache:", event.request.url);
          return response;
        }
        console.log("[SW] Fetch from network:", event.request.url);
        return fetch(event.request);
      })
      .catch((err) => {
        console.error("[SW] Error fetching:", err);
        throw err;
      })
  );
});

self.addEventListener("push", (event) => {
  console.log("[SW] Push received, raw data:", event.data?.text());

  let data = {
    title: "Notifikasi Baru",
    body: "Ada pesan baru untukmu!",
  };

  if (event.data) {
    try {
      const incoming = JSON.parse(event.data.text());
      data.title = incoming.title || data.title;
      data.body = incoming.body || data.body;
    } catch (error) {
      console.warn(
        "Data push bukan JSON Valid, menggunakan teks mentah",
        event.data.text()
      );
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: "/images/icon.png",
    badge: "/images/icon.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
