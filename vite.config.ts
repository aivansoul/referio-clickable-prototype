import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/referio-clickable-prototype/',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'react-vendor'
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion-vendor'
          if (id.includes('node_modules/qrcode')) return 'qr-vendor'
        },
      },
    },
  },
})
