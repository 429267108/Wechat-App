import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: './' ensures assets are loaded relatively, avoiding 404s when deployed to subpaths or webviews
  base: './',
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0'
  }
});