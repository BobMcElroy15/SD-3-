// service-worker.js

const CACHE_VERSION = 1;
const CACHE_NAME    = `sd3ps-cache-v${CACHE_VERSION}`;

// URLs to precache during installation
const PRECACHE_URLS = [
  '/',               // index.html
  '/index.html',
  '/manifest.json',
  '/qr-code.png',
  '/icons/192.png',
  '/icons/512.png',
  // Leaflet assets
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  // Firebase compat SDKs
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js'
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML, cache-first for everything else
self.addEventListener('fetch', event => {
  const req = event.request;

  // Network-first for navigation requests (HTML pages)
  if (req.mode === 'navigate' ||
      (req.method === 'GET' && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then(response => {
          // Update cache with fresh HTML
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return response;
        })
        .catch(() =>
          caches.match('/') || caches.match('/index.html')
        )
    );
    return;
  }

  // Cache-first for all other requests (JS/CSS/images/etc.)
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(response => {
        // Cache the fetched resource
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return response;
      });
    })
  );
});
