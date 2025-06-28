// service-worker.js
const CACHE_VERSION = 3;            // ← bump this on every update
const CACHE_NAME    = `sd3ps-v${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/',               // root → index.html
  '/index.html',
  '/manifest.json',
  '/qr-code.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Leaflet assets if you want offline tiles/css/js:
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 1. Install: precache the app shell
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 2. Activate: clean up old caches
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

// 3. Fetch: network-first for navigations, cache-first for everything else
self.addEventListener('fetch', evt => {
  const req = evt.request;

  // a) HTML pages (navigations) → network first
  if (req.mode === 'navigate' ||
      (req.method === 'GET' && req.headers.get('accept').includes('text/html'))) {
    evt.respondWith(
      fetch(req)
        .then(res => {
          // update the cache for offline fallback
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return res;
        })
        .catch(() => {
          // fallback to the cached index.html
          return caches.match('/') 
                 || caches.match('/index.html');
        })
    );
    return;
  }

  // b) Other assets → cache-first
  evt.respondWith(
    caches.match(req).then(cached => 
      cached || fetch(req).then(res => {
        // cache new assets
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      })
    )
  );
});
