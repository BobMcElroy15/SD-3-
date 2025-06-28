// service-worker.js

const CACHE_VERSION = 1;
const CACHE_NAME    = `sd3ps-cache-v${CACHE_VERSION}`;

// List of URLs to precache
const PRECACHE_URLS = [
  '/',               // Alias for index.html
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

// INSTALL: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH: network-first for navigations, cache-first for everything else
self.addEventListener('fetch', event => {
  const req = event.request;

  // Network-first for HTML pages (navigations)
  if (req.mode === 'navigate' ||
      (req.method === 'GET' && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then(response => {
          // Update cache with the fresh HTML
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

  // Cache-first for all other assets
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(response => {
        // Cache the new resource
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return response;
      });
    })
  );
});
