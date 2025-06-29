// service-worker.js (improved)

self.addEventListener('install', evt => {
  evt.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
  evt.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(cacheNames.map(cache => caches.delete(cache)))
    )
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(fetch(evt.request));
});
