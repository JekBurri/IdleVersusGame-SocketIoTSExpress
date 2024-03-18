import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv(
  'all',
  process.cwd()
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ws': {
        target: 'ws://'+env.VITE_URL+':3000',
        ws: true,
      },
    }
  }
})
