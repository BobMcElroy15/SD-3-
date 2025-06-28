// service-worker.js

// ↑↑ bump this on every update ↑↑
const CACHE_VERSION = 4;
const CACHE_NAME    = `sd3ps-cache-v${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',                // root → index.html
  '/index.html',
  '/manifest.json',
  '/qr-code.png',
  // your local icons
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Leaflet assets
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  // Firebase compat SDKs
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js'
];

// 1) Install – precache the app shell and SDKs
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 2) Activate – delete any old caches
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 3) Fetch – Network‐First for HTML navigations, Cache‐First for everything else
self.addEventListener('fetch', evt => {
  const req = evt.request;

  // a) HTML pages (navigations) – Network first, fallback to cache
  if (req.mode === 'navigate' ||
     (req.method === 'GET' && req.headers.get('accept').includes('text/html'))) {
    evt.respondWith(
      fetch(req)
        .then(res => {
          // update our cache for offline
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // b) All other requests – Cache first, then network & cache
  evt.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      });
    })
  );
});
