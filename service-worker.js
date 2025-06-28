// service-worker.js

const CACHE_VERSION = 5;
const CACHE_NAME    = `sd3ps-cache-v${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/', '/index.html', '/manifest.json', '/qr-code.png',
  '/icons/icon-192.png', '/icons/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js'
];

// Install: cache shell & SDKs
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
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

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', evt => {
  const req = evt.request;

  // HTML navigations → network-first
  if (req.mode === 'navigate' ||
     (req.method === 'GET' && req.headers.get('accept').includes('text/html'))) {
    evt.respondWith(
      fetch(req)
        .then(res => {
          // update cache
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // Other requests → cache-first
  evt.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      })
    )
  );
});
