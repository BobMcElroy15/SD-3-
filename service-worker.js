// service-worker.js

const CACHE_VERSION = 4; 
const CACHE_NAME    = `sd3ps-cache-v${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',                // index.html
  '/index.html',
  '/manifest.json',
  '/qr-code.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Leaflet assets
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  // Firebase compat SDKs
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js'
];

// 1) Install: precache core assets & SDKs
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 2) Activate: purge old caches
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

// 3) Fetch: network-first for HTML navigations, cache-first for everything else
self.addEventListener('fetch', evt => {
  const req = evt.request;

  // a) HTML navigation requests → network first
  if (req.mode === 'navigate' ||
     (req.method === 'GET' && req.headers.get('accept').includes('text/html'))) {
    evt.respondWith(
      fetch(req)
        .then(res => {
          // update the cached app shell
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // b) Other requests → cache-first, then network fallback (& cache new)
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
