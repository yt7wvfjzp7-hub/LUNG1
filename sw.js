const CACHE_NAME = "birthday-app-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/background.jpg",
  "./assets/apple-touch-icon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/letter-photo.jpg",
  "./assets/photo-1.jpg",
  "./assets/photo-2.jpg",
  "./assets/photo-3.jpg",
  "./assets/photo-4.jpg",
  "./assets/photo-5.jpg",
  "./assets/photo-6.jpg",
  "./assets/photo-7.jpg",
  "./assets/photo-8.jpg",
  "./assets/photo-9.jpg",
  "./assets/photo-10.png",
  "./assets/photo-11.jpg",
  "./assets/photo-12.jpg",
  "./assets/photo-13.jpg",
  "./assets/photo-14.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
