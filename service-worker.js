// service-worker.js

self.addEventListener('install', evt => {
  // Activate immediately
  evt.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', evt => {
  // Take control of clients right away
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  // Always go to the network—never cache
  evt.respondWith(fetch(evt.request));
});
