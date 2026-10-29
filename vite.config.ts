import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes on local network and localhost
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
