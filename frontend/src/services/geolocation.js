// Geolocation Service for BangoPoints PWA

/**
 * Get current GPS position
 * @returns {Promise<GeolocationPosition>}
 */
export async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('[Geolocation] Position acquired:', position.coords);
        resolve(position);
      },
      (error) => {
        console.error('[Geolocation] Error:', error);
        
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Please check your GPS settings.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }
        
        reject(new Error(message));
      },
      options
    );
  });
}

/**
 * Watch position changes
 * @param {Function} callback - Called with new position
 * @returns {number} Watch ID for clearing
 */
export function watchPosition(callback) {
  if (!('geolocation' in navigator)) {
    console.error('[Geolocation] Not supported');
    return null;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      console.log('[Geolocation] Position updated:', position.coords);
      callback(position);
    },
    (error) => {
      console.error('[Geolocation] Watch error:', error);
    },
    options
  );

  console.log('[Geolocation] Watching position:', watchId);
  return watchId;
}

/**
 * Stop watching position
 * @param {number} watchId
 */
export function clearWatch(watchId) {
  if (watchId !== null && 'geolocation' in navigator) {
    navigator.geolocation.clearWatch(watchId);
    console.log('[Geolocation] Stopped watching:', watchId);
  }
}

/**
 * Format coordinates for display
 * @param {GeolocationPosition} position
 * @returns {Object}
 */
export function formatCoordinates(position) {
  return {
    latitude: position.coords.latitude.toFixed(6),
    longitude: position.coords.longitude.toFixed(6),
    accuracy: Math.round(position.coords.accuracy),
    timestamp: new Date(position.timestamp).toISOString()
  };
}

/**
 * Calculate distance between two points (Haversine formula)
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if location is within allowed radius of a point
 * @param {GeolocationPosition} position
 * @param {number} targetLat
 * @param {number} targetLon
 * @param {number} radiusMeters
 * @returns {boolean}
 */
export function isWithinRadius(position, targetLat, targetLon, radiusMeters) {
  const distance = calculateDistance(
    position.coords.latitude,
    position.coords.longitude,
    targetLat,
    targetLon
  );
  
  return distance <= radiusMeters;
}

/**
 * Request location permission
 * @returns {Promise<PermissionStatus>}
 */
export async function requestPermission() {
  try {
    if ('permissions' in navigator) {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      console.log('[Geolocation] Permission status:', result.state);
      return result;
    }
    
    // Fallback: try to get position (will prompt for permission)
    await getCurrentPosition();
    return { state: 'granted' };
  } catch (error) {
    console.error('[Geolocation] Permission error:', error);
    return { state: 'denied' };
  }
}

/**
 * Check if geolocation is supported
 * @returns {boolean}
 */
export function isSupported() {
  return 'geolocation' in navigator;
}

export default {
  getCurrentPosition,
  watchPosition,
  clearWatch,
  formatCoordinates,
  calculateDistance,
  isWithinRadius,
  requestPermission,
  isSupported
};
