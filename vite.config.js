import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/espn-api': {
        target: 'https://site.api.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/espn-api/, ''),
      },
      '/espn-web-api': {
        target: 'https://site.web.api.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/espn-web-api/, ''),
      },
    },
  },
})
