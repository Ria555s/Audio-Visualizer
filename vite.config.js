import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your specific plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Audio-Visualizer/', 
})