// BangoPoints Service Worker
const CACHE_VERSION = 'v1';
const CACHE_NAME = `bangopoints-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/images/bango-PrA-150x150.png',
  '/images/bango-PrA-300x300.png',
  '/images/bango-actual-300x168.png',
  '/favicon.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for API requests
              return new Response(
                JSON.stringify({ error: 'Offline - request queued' }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Static assets - cache first, fallback to network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseClone = response.clone();
            
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Background sync for queued requests
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-receipts') {
    event.waitUntil(syncReceipts());
  }
  
  if (event.tag === 'sync-clock-records') {
    event.waitUntil(syncClockRecords());
  }
});

// Push notification
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'BangoPoints';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/images/bango-PrA-300x300.png',
    badge: '/images/bango-PrA-150x150.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const url = event.notification.data || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Helper functions for background sync
async function syncReceipts() {
  // Get queued receipts from IndexedDB
  // Send to API
  // Remove from queue on success
  console.log('[SW] Syncing receipts...');
}

async function syncClockRecords() {
  // Get queued clock records from IndexedDB
  // Send to API
  // Remove from queue on success
  console.log('[SW] Syncing clock records...');
}

// Message handler for communication with app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.payload))
    );
  }
});
