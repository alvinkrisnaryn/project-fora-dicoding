const CACHE_NAME = "fora-app-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/public/images/logo.png",
  "/public/images/favicon.png",
  "/public/manifest.json",
  // Tambahkan aset lain yang diperlukan, misalnya font atau gambar di public/
];

// Event install: Cache aset statis
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files", urlsToCache);
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Service Worker: Cache addAll failed:", error);

        // Log file yang gagal
        urlsToCache.forEach((url) => {
          fetch(url).catch((err) =>
            console.error(`Failed to fetch ${url}:`, err)
          );
        });
      });
    })
  );
});

// Event activate: Bersihkan cache lama jika ada
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Event fetch: Layani dari cache untuk aset statis, fetch untuk API
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("story-api.dicoding.dev")) {
    event.respondWith(
      caches.open("api-cache").then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(
              () =>
                cachedResponse ||
                new Response("API unavailable", { status: 503 })
            );
          return cachedResponse || fetchPromise;
        })
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(
        (response) =>
          response ||
          fetch(event.request).catch(
            () => caches.match("/index.html") // Fallback ke index.html
          )
      )
    );
  }
});

// Event Push: Tangani push notification
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
    icon: "/public/images/logo.png",
    badge: "/public/images/favicon.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Event notificationonclick: Buka Aplikasi saat notifikasi diklik
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
