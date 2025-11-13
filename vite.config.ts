import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/orthanc-api': {
        target: 'http://localhost:8042',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/orthanc-api/, ''),
      }
    }
  }
})