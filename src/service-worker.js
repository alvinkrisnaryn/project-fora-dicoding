const CACHE_NAME = 'fora-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.bundle.js',
  '/styles.css',
  '/images/logo.png',
  '/images/favicon.png',
  '/manifest.json',
  // Tambahkan aset lain yang diperlukan, misalnya font atau gambar di public/
];

// Event install: Cache aset statis
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Event activate: Bersihkan cache lama jika ada
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Event fetch: Layani dari cache untuk aset statis, fetch untuk API
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('story-api.dicoding.dev')) {
    console.log('Service Worker: Fetching API:', event.request.url);
    return fetch(event.request); // Langsung fetch untuk API
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('Service Worker: Serving from cache:', event.request.url);
        return response;
      }
      console.log('Service Worker: Fetching from network:', event.request.url);
      return fetch(event.request);
    })
  );
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
    icon: "./images/logo.png",
    badge: "./images/favicon.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Event notificationonclick: Buka Aplikasi saat notifikasi diklik
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/index.html"));
});
