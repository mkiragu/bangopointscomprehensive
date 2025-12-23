// Web Notifications Service for BangoPoints PWA

/**
 * Check if notifications are supported
 * @returns {boolean}
 */
export function isSupported() {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 * @returns {string} 'granted', 'denied', or 'default'
 */
export function getPermissionStatus() {
  if (!isSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission
 * @returns {Promise<string>} Permission status
 */
export async function requestPermission() {
  if (!isSupported()) {
    console.warn('[Notifications] Not supported in this browser');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('[Notifications] Permission:', permission);
    return permission;
  } catch (error) {
    console.error('[Notifications] Permission error:', error);
    return 'denied';
  }
}

/**
 * Show a notification
 * @param {string} title
 * @param {Object} options
 * @returns {Notification|null}
 */
export function showNotification(title, options = {}) {
  if (!isSupported()) {
    console.warn('[Notifications] Not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('[Notifications] Permission not granted');
    return null;
  }

  const defaultOptions = {
    icon: '/images/bango-PrA-300x300.png',
    badge: '/images/bango-PrA-150x150.png',
    vibrate: [200, 100, 200],
    tag: 'bangopoints-notification',
    renotify: false,
    requireInteraction: false
  };

  const notificationOptions = { ...defaultOptions, ...options };

  try {
    const notification = new Notification(title, notificationOptions);

    // Handle click
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      
      if (options.data && options.data.url) {
        window.location.href = options.data.url;
      }
      
      notification.close();
    };

    return notification;
  } catch (error) {
    console.error('[Notifications] Show error:', error);
    return null;
  }
}

/**
 * Show notification via service worker (for background notifications)
 * @param {string} title
 * @param {Object} options
 * @returns {Promise<void>}
 */
export async function showServiceWorkerNotification(title, options = {}) {
  if (!('serviceWorker' in navigator)) {
    console.warn('[Notifications] Service Worker not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const defaultOptions = {
      icon: '/images/bango-PrA-300x300.png',
      badge: '/images/bango-PrA-150x150.png',
      vibrate: [200, 100, 200],
      tag: 'bangopoints-sw-notification',
      data: {}
    };

    const notificationOptions = { ...defaultOptions, ...options };

    await registration.showNotification(title, notificationOptions);
    console.log('[Notifications] Service Worker notification shown');
  } catch (error) {
    console.error('[Notifications] Service Worker notification error:', error);
  }
}

/**
 * Notify about points awarded
 * @param {number} points
 */
export function notifyPointsAwarded(points) {
  showNotification('Points Awarded! 🎉', {
    body: `You've earned ${points} points! Check your balance now.`,
    data: { url: '/shopper/dashboard' },
    tag: 'points-awarded'
  });
}

/**
 * Notify about points expiration
 * @param {number} points
 * @param {string} date
 */
export function notifyPointsExpiring(points, date) {
  showNotification('Points Expiring Soon ⚠️', {
    body: `${points} points will expire on ${date}. Redeem them now!`,
    data: { url: '/shopper/rewards' },
    tag: 'points-expiring',
    requireInteraction: true
  });
}

/**
 * Notify about receipt status
 * @param {string} status - 'approved', 'rejected', 'flagged'
 * @param {string} receiptId
 */
export function notifyReceiptStatus(status, receiptId) {
  const titles = {
    approved: 'Receipt Approved ✓',
    rejected: 'Receipt Rejected ✗',
    flagged: 'Receipt Flagged for Review'
  };

  const bodies = {
    approved: 'Your receipt has been approved and points have been awarded.',
    rejected: 'Your receipt was rejected. Please check the details.',
    flagged: 'Your receipt has been flagged for manual review.'
  };

  showNotification(titles[status] || 'Receipt Update', {
    body: bodies[status] || 'Your receipt status has changed.',
    data: { url: `/shopper/receipts/${receiptId}` },
    tag: `receipt-${receiptId}`
  });
}

/**
 * Notify PPG about late clock-in
 */
export function notifyLateClockIn() {
  showNotification('Late Clock-In Reminder ⏰', {
    body: 'You haven\'t clocked in yet. Please clock in now.',
    data: { url: '/ppg/clock-in' },
    tag: 'late-clock-in',
    requireInteraction: true,
    vibrate: [300, 200, 300, 200, 300]
  });
}

/**
 * Notify about supervisor message
 * @param {string} message
 * @param {string} from
 */
export function notifySupervisorMessage(message, from) {
  showNotification(`Message from ${from}`, {
    body: message,
    data: { url: '/notifications' },
    tag: 'supervisor-message',
    requireInteraction: true
  });
}

/**
 * Notify about performance target
 * @param {number} current
 * @param {number} target
 */
export function notifyPerformanceTarget(current, target) {
  const percentage = Math.round((current / target) * 100);
  
  showNotification('Performance Update 📊', {
    body: `You're at ${percentage}% of your daily target (${current}/${target} receipts).`,
    data: { url: '/ppg/dashboard' },
    tag: 'performance-update'
  });
}

/**
 * Test notification (for debugging)
 */
export function testNotification() {
  showNotification('Test Notification', {
    body: 'If you see this, notifications are working!',
    tag: 'test-notification'
  });
}

export default {
  isSupported,
  getPermissionStatus,
  requestPermission,
  showNotification,
  showServiceWorkerNotification,
  notifyPointsAwarded,
  notifyPointsExpiring,
  notifyReceiptStatus,
  notifyLateClockIn,
  notifySupervisorMessage,
  notifyPerformanceTarget,
  testNotification
};
