import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'images/*.png', 'offline.html'],
      manifest: {
        name: 'BangoPoints Loyalty Platform',
        short_name: 'BangoPoints',
        description: "Kenya's premier loyalty rewards platform",
        theme_color: '#c0c0c0',
        background_color: '#121212',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/images/bango-PrA-150x150.png',
            sizes: '150x150',
            type: 'image/png'
          },
          {
            src: '/images/bango-PrA-300x300.png',
            sizes: '300x300',
            type: 'image/png'
          },
          {
            src: '/images/bango-PrA-768x768.png',
            sizes: '768x768',
            type: 'image/png'
          },
          {
            src: '/images/bango-PrA-1024x1024.png',
            sizes: '1024x1024',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
