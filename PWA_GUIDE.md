# BangoPoints Progressive Web App (PWA) Guide

## Overview

BangoPoints is now a fully functional Progressive Web App with native-like capabilities including camera access, geolocation tracking, offline support, and push notifications.

## PWA Features

### ✅ Installable
- Add to home screen on mobile and desktop
- Works like a native app
- No app store required
- Automatic updates

### ✅ Offline Support
- Service worker with intelligent caching
- Works without internet connection
- Queues actions for later sync
- Graceful degradation

### ✅ Camera Access
- Take receipt photos directly in the app
- Switch between front and back cameras
- High-quality image capture
- Works on iOS and Android

### ✅ Geolocation
- GPS tracking for clock in/out
- Location accuracy reporting
- Distance calculations
- Permission handling

### ✅ Push Notifications
- Supervisor alerts
- Points awarded notifications
- Receipt status updates
- Performance reminders

### ✅ OCR Processing
- Extract text from receipt images
- Parse receipt structure
- Auto-populate form fields
- Client-side processing

## Installation

### On Mobile (iOS)
1. Open `https://your-domain.com` in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen

### On Mobile (Android)
1. Open `https://your-domain.com` in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Tap "Add"
5. App icon appears on home screen

### On Desktop
1. Open `https://your-domain.com` in Chrome or Edge
2. Click the install icon in the address bar (⊕)
3. Click "Install"
4. App opens in standalone window

## Usage

### Camera

```jsx
import Camera from '@/components/Camera';

function MyComponent() {
  const handleCapture = (imageData) => {
    // imageData is base64 encoded image
    console.log('Photo captured!', imageData);
  };

  return (
    <Camera 
      onCapture={handleCapture}
      onClose={() => console.log('Camera closed')}
    />
  );
}
```

### Geolocation

```javascript
import { getCurrentPosition, watchPosition } from '@/services/geolocation';

// Get current position
const position = await getCurrentPosition();
console.log(position.coords.latitude, position.coords.longitude);

// Watch position changes
const watchId = watchPosition((position) => {
  console.log('Position updated:', position);
});

// Stop watching
clearWatch(watchId);
```

### Notifications

```javascript
import { requestPermission, showNotification } from '@/services/notifications';

// Request permission first
await requestPermission();

// Show notification
showNotification('Points Awarded!', {
  body: 'You earned 500 points',
  icon: '/images/bango-PrA-300x300.png',
  data: { url: '/shopper/dashboard' }
});
```

### OCR

```javascript
import { parseReceipt } from '@/services/ocr';

// Parse receipt from image
const result = await parseReceipt(imageData);

console.log(result.items);          // Extracted items
console.log(result.total);          // Total amount
console.log(result.receiptNumber);  // Receipt number
```

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Service Worker | ✅ 40+ | ✅ 11.3+ | ✅ 44+ | ✅ 17+ |
| Camera | ✅ 53+ | ✅ 11+ | ✅ 36+ | ✅ 79+ |
| Geolocation | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Notifications | ✅ Yes | ✅ 16.4+ | ✅ Yes | ✅ Yes |
| Install Prompt | ✅ Yes | ✅ iOS 11.3+ | ❌ No | ✅ Yes |

## Development

### Local Development
```bash
cd frontend
npm install
npm run dev
```

**Note**: Some PWA features require HTTPS. In development, localhost is treated as secure.

### Production Build
```bash
npm run build
```

This creates an optimized production build with:
- Service worker registration
- Manifest file
- Cached assets
- Optimized bundles

### Testing PWA

1. **Lighthouse Audit**:
   ```bash
   # In Chrome DevTools
   Open DevTools → Lighthouse → Run audit
   ```

2. **Service Worker**:
   ```bash
   # In Chrome DevTools
   Application → Service Workers
   ```

3. **Manifest**:
   ```bash
   # In Chrome DevTools
   Application → Manifest
   ```

## Deployment

### Requirements
- **HTTPS**: Mandatory for PWA features
- **Service Worker**: Must be served from same origin
- **Manifest**: Must be accessible at `/manifest.json`

### Build for Production
```bash
cd frontend
npm install
npm run build
```

### Deploy Files
Copy `dist/` folder to your web server. Ensure:
- `sw.js` is served from root
- `manifest.json` is accessible
- HTTPS is enabled
- Proper MIME types are set

### Update Strategy
Service worker automatically checks for updates:
- On page load
- Every hour
- When tab gains focus

Users are notified of updates and can reload to apply.

## Troubleshooting

### Camera Not Working
- **Check Permissions**: Settings → Site Settings → Camera
- **HTTPS Required**: Camera only works on HTTPS (or localhost)
- **Browser Support**: Ensure browser supports getUserMedia

### Geolocation Not Working
- **Check Permissions**: Settings → Site Settings → Location
- **HTTPS Required**: Location works better on HTTPS
- **GPS Signal**: Ensure device has GPS enabled

### Offline Mode Not Working
- **Service Worker**: Check if registered in DevTools
- **Cache**: Clear browser cache and reload
- **HTTPS**: Some browsers restrict SW to HTTPS

### Install Prompt Not Showing
- **Already Installed**: App may already be installed
- **Criteria Not Met**: Must meet PWA criteria (manifest, SW, HTTPS)
- **iOS**: Use "Add to Home Screen" from Share menu

## Performance

### Cache Strategy
- **Static Assets**: Cache-first (HTML, CSS, JS, images)
- **API Calls**: Network-first with fallback to cache
- **Updates**: Check every hour, apply on next load

### Offline Capabilities
- Read cached content
- View cached receipts
- Check points balance (last known)
- Queue uploads for later sync
- Show offline fallback page

### Data Usage
- Initial load: ~500KB (including vendor bundles)
- Cached assets: ~2MB (images, fonts, scripts)
- API responses: Varies (cached for 5 minutes)

## Best Practices

### For Users
1. Grant camera and location permissions when prompted
2. Keep app updated (reload when notified)
3. Use WiFi for initial install
4. Clear cache if experiencing issues

### For Developers
1. Test on actual devices, not just DevTools
2. Test offline functionality
3. Handle permission denials gracefully
4. Provide fallbacks for unsupported browsers
5. Keep service worker updated
6. Monitor cache size

## Security

### Permissions
- **Camera**: Required for receipt capture
- **Location**: Required for clock in/out
- **Notifications**: Optional, for alerts
- **Storage**: For caching (automatic)

All permissions must be explicitly granted by the user. The app provides clear explanations before requesting permissions.

### Data Privacy
- Location is only collected during clock in/out
- Photos are processed locally (OCR)
- Cached data is stored securely
- Service worker has limited scope

## Future Enhancements

- [ ] Background sync for all offline actions
- [ ] Push notification server integration
- [ ] Improved OCR accuracy with ML models
- [ ] Biometric authentication
- [ ] Offline-first data management with IndexedDB
- [ ] Advanced caching strategies
- [ ] Payment integration

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Tesseract.js](https://tesseract.projectnaptha.com/)

## Support

For issues or questions about PWA features:
1. Check browser console for errors
2. Verify HTTPS is enabled
3. Check service worker status in DevTools
4. Ensure permissions are granted
5. Try clearing cache and reloading

---

**BangoPoints PWA** - Native app experience without the app store!
