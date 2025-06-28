// service-worker.js
const CACHE_VERSION = 2; // ← bump this on every major update
const CACHE_NAME = `sd3ps-cache-v${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/',              // makes index.html cacheable
  '/index.html',
  '/manifest.json',
  '/qr-code.png',
  // if you have an icons folder, list them here:
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // you can also cache the Leaflet CSS/JS if you want:
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

// Install – precache the “shell”
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate – purge old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch – network-first for navigation, cache-first for everything else
self.addEventListener('fetch', event => {
  const req = event.request;

  // For HTML pages (navigations), do NetworkFirst
  if (req.mode === 'navigate' || (req.method === 'GET'
      && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then(resp => {
          // update cache
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return resp;
        })
        .catch(() =>
          caches.match(req).then(cached => cached)
        )
    );
    return;
  }

  // For everything else, you can do CacheFirst (or adjust as needed)
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(resp => {
        // optionally cache new resources
        const copy = resp.clone();
        caches.open(CACHE_NAME)
              .then(cache => cache.put(req, copy));
        return resp;
      });
    })
  );
});
