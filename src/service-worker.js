import { getAllStories } from "./scripts/utils/indexedDB.js";

const CACHE_NAME = "fora-app-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/[name].[contenthash].css",
  "/[name].[contenthash].bundle.js",
  "./images/logo.png",
  "./images/favicon.png",
  "/manifest.json",
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
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("story-api.dicoding.dev/stories")) {
    e.respondWith(
      caches.open("api-cache").then((cache) => {
        return fetch(e.request)
          .then((networkResponse) => {
            if (e.request.method === "GET") {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(async () => {
            const cachedResponse = await cache.match(e.request);
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback ke IndexedDB
            try {
              const stories = await getAllStories();
              if (stories && stories.length > 0) {
                return new Response(JSON.stringify({ listStory: stories }), {
                  headers: { "Content-Type": "application/json" },
                });
              }
            } catch (error) {
              console.error("IndexedDB fallback failed:", error);
            }
            return new Response("API unavailable", { status: 503 });
          });
      })
    );
  } else {
    e.respondWith(
      caches
        .match(e.request)
        .then(
          (response) =>
            response ||
            fetch(e.request).catch(() => caches.match("/index.html"))
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
