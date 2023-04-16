import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { prismjsPlugin } from 'vite-plugin-prismjs'
import { URL, fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    prismjsPlugin({
      languages: 'all'
    }),
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
