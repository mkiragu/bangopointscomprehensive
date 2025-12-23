// PWA Registration and Update Management

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60); // Check every hour

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[PWA] Service Worker update found');

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service Worker controller changed');
        window.location.reload();
      });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[PWA] Service Worker unregistered');
      })
      .catch((error) => {
        console.error('[PWA] Service Worker unregistration failed:', error);
      });
  }
}

function showUpdateNotification() {
  // Show a notification to the user
  const updateBanner = document.createElement('div');
  updateBanner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #c0c0c0;
    color: #121212;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 1rem;
  `;

  updateBanner.innerHTML = `
    <span>A new version is available!</span>
    <button id="reload-btn" style="
      background: #121212;
      color: #c0c0c0;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: 600;
    ">Update Now</button>
    <button id="dismiss-btn" style="
      background: transparent;
      color: #121212;
      border: 1px solid #121212;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
    ">Later</button>
  `;

  document.body.appendChild(updateBanner);

  document.getElementById('reload-btn').addEventListener('click', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
    }
  });

  document.getElementById('dismiss-btn').addEventListener('click', () => {
    updateBanner.remove();
  });
}

// Install prompt
let deferredPrompt = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log('[PWA] Install prompt ready');

    // Show install button
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    deferredPrompt = null;
    hideInstallButton();
  });
}

function showInstallButton() {
  const installBtn = document.getElementById('install-pwa-btn');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] User choice:', outcome);
        deferredPrompt = null;
      }
    });
  }
}

function hideInstallButton() {
  const installBtn = document.getElementById('install-pwa-btn');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
}

// Network status
export function setupNetworkListener() {
  window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    showNetworkStatus("You're back online!", 'success');
    
    // Trigger background sync if supported
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-receipts').catch(console.error);
        registration.sync.register('sync-clock-records').catch(console.error);
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Offline');
    showNetworkStatus("You're offline. Changes will sync when you reconnect.", 'warning');
  });
}

function showNetworkStatus(message, type) {
  const statusBanner = document.createElement('div');
  const bgColor = type === 'success' ? '#28a745' : '#ffc107';
  
  statusBanner.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${bgColor};
    color: #121212;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    z-index: 10000;
    font-weight: 600;
  `;

  statusBanner.textContent = message;
  document.body.appendChild(statusBanner);

  setTimeout(() => {
    statusBanner.remove();
  }, 3000);
}

// Initialize all PWA features
export function initPWA() {
  registerServiceWorker();
  setupInstallPrompt();
  setupNetworkListener();
  
  console.log('[PWA] Initialized');
}
