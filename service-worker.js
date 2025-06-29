// service-worker.js

const CACHE_VERSION = 1;
const CACHE_NAME    = `sd3ps-cache-v${CACHE_VERSION}`;

// Only cache the bare essentials for offline shell:
const PRECACHE_URLS = [
  '/',               // alias for index.html
  '/index.html',
  '/manifest.json',
  '/icons/192.png',
  '/icons/512.png',
  '/qr-code.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

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

self.addEventListener('fetch', event => {
  const req = event.request;

  // Network-first for navigations (HTML)
  if (
    req.mode === 'navigate' ||
    (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))
  ) {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Update the shell cache
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // For everything else, try cache, then network
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req);
    })
  );
});
