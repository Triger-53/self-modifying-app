import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
      },
      manifest: {
        name: 'Ultra IDE - Self-Modifying',
        short_name: 'UltraIDE',
        description: 'A premium self-modifying application built with Vite and React',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: './',
  build: {
    rollupOptions: {
      external: [
        'electron',
        'fs',
        'path',
        'os',
        'crypto',
        'stream',
        'util',
        'events',
        'buffer',
        'child_process'
      ]
    }
  }
})
