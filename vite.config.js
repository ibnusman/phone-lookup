import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  css: {
    postcss: {}  // You don't need to specify the path to postcss.config.js here
  }
})
