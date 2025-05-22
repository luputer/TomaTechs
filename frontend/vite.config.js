import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'images/icons/favicon.ico',
        'images/icons/apple-touch-icon.png',
        'images/icons/masked-icon.svg'
      ],
      manifest: {
        name: 'TomaTechs',
        short_name: 'TomaTechs',
        description: 'TomaTechs - Tomato Disease Detection App',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'images/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'images/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
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
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      'd7a6-2400-9800-bc4-4527-74c8-bc85-1fa3-9de8.ngrok-free.app',
      // bisa tambahkan host lain sesuai kebutuhan
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Meningkatkan batas warning ke 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-alert-dialog', '@radix-ui/react-dialog', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-tooltip'],
          utils: ['axios', 'date-fns', 'clsx', 'tailwind-merge'],
          // Tambahkan chunk lain sesuai kebutuhan
        }
      }
    },
    assetsInlineLimit: 4096, // 4kb
    assetsDir: 'assets',
    sourcemap: true, // Menambahkan sourcemap untuk debugging
    minify: false, // Menonaktifkan minifikasi untuk development
  },
  preview: {
    port: 5173, // Menggunakan port yang sama dengan dev server
    strictPort: true,
    host: true,
    open: true
  }
})
