// service-worker.js

self.addEventListener('install', evt => {
  // immediately activate without doing anything
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  // take control right away
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  // bypass cache entirely
  evt.respondWith(fetch(evt.request));
});
