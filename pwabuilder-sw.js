// This is the "Offline copy of pages" service worker

const CACHE = "salah-pwa-v1";
const RUNTIME_CACHE = "salah-runtime-v1";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache app shell (HTML, CSS, JS) with cache first strategy
workbox.routing.registerRoute(
  ({request}) => request.destination === 'document' ||
                 request.destination === 'script' ||
                 request.destination === 'style',
  new workbox.strategies.CacheFirst({
    cacheName: CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Cache images with cache first strategy
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'salah-images-v1',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// API calls - Network first with fallback to cache (for prayer times)
workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://www.londonprayertimes.com' ||
             url.origin === 'https://api.sunrise-sunset.org' ||
             url.origin === 'https://api.aladhan.com' ||
             url.origin === 'https://api.alquran.cloud',
  new workbox.strategies.NetworkFirst({
    cacheName: RUNTIME_CACHE,
    networkTimeoutSeconds: 10,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Install event - pre-cache essential files
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE && cacheName !== RUNTIME_CACHE && cacheName !== 'salah-images-v1') {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});
