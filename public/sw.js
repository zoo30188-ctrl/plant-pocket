const CACHE_NAME = 'plant-pocket-v1.1.0-SWR';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Exclude non-GET requests and external extensions
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Stale-While-Revalidate pattern
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        // Update cache with the new response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // Network failed (offline), do nothing because we will serve cachedResponse if available
      });

      // Serve from cache immediately if we have it, else wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
