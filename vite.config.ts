import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    modulePreload: { polyfill: true },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) {
            return 'vendor'
          }
          // Only the @iconify/vue RUNTIME goes into the icons chunk.
          // @iconify-json/* data stays in the main app bundle (it must be
          // available synchronously when main.ts calls addCollection).
          if (id.includes('node_modules/@iconify/vue/')) {
            return 'icons'
          }
          return undefined
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@iconify/vue'],
  },
})
