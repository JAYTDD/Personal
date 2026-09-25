import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

import { netlifyFunctionsDev } from './plugins/netlifyFunctionsDev'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue(), mode === 'development' && vueDevTools(), tailwindcss(), netlifyFunctionsDev(mode)].filter(
    Boolean,
  ),
  server: {
    port: 5200, // 将端口指定为你想要的数字
    strictPort: true, // 可选：如果端口被占用，直接退出而不是尝试下一个可用端口
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/vue-router') ||
            id.includes('node_modules/pinia')
          ) {
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
}))
