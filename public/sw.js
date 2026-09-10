// GramaPala Service Worker for Offline Field Worker Sync & Caching
const CACHE_NAME = 'gramapala-offline-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json'
];

// 1. Install Event - Precache critical app shell
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing GramaPala Offline SW...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precaching core app shell & offline assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Precache partial error (will resolve dynamically):', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating GramaPala Offline SW...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[ServiceWorker] Removing legacy cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event - Stale-While-Revalidate for App Shell & Cache-First for static assets & photos
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests (e.g. POSTs are handled by IndexedDB/localStorage sync queue)
  if (request.method !== 'GET') {
    return;
  }

  // Handle Chrome extension schemes or non-http
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // A. Image requests (Unsplash photos, repair proofs, icons): Cache-First with Network fallback
  if (
    request.destination === 'image' || 
    url.hostname.includes('images.unsplash.com') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          // Return cached image immediately, refresh in background
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
          }).catch(() => {});
          return cachedResponse;
        }

        // Not in cache, fetch from network and store
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // If offline and not in cache, fallback to default SVG icon
          const fallback = await cache.match('/icon.svg');
          return fallback || new Response('', { status: 408, statusText: 'Offline' });
        }
      })
    );
    return;
  }

  // B. HTML / Navigation requests: Network-First with Cache fallback
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[ServiceWorker] Offline mode: Serving cached HTML document');
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match('/index.html') || await cache.match('/');
          return cached || new Response('Offline: GramaPala is active with cached data.', {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // C. Script & Stylesheet assets: Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Background Sync event for offline repair tasks upload
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync event triggered:', event.tag);
  if (event.tag === 'sync-field-tasks' || event.tag === 'sync-repair-photos') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'GRAMAPALA_BACKGROUND_SYNC',
            tag: event.tag,
            timestamp: Date.now()
          });
        });
      })
    );
  }
});

// 5. Message listener from client apps
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'TRIGGER_SYNC') {
    console.log('[ServiceWorker] Manual sync triggered from client UI');
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'GRAMAPALA_FORCE_SYNC',
          timestamp: Date.now()
        });
      });
    });
  }
});
