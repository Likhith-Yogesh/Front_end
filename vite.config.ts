import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Read system config
const systemConfigPath = path.resolve(__dirname, 'config/systemConfig.json')
const systemConfig = JSON.parse(fs.readFileSync(systemConfigPath, 'utf-8'))
const orthancConfigPath = path.resolve(__dirname, 'config/orthancConfig.json')
const orthancConfig = JSON.parse(fs.readFileSync(orthancConfigPath, 'utf-8'))

export default defineConfig({
  plugins: [react()],
  server: {
    host: systemConfig.host,
    port: systemConfig.port,
    proxy: {
      '/orthanc-api': {
        target: `http://${orthancConfig.host}:${orthancConfig.port}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/orthanc-api/, ''),
      }
    }
  }
})