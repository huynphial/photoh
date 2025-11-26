import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'data',
          dest: '' // Copy 'data' folder to the root of 'dist'
        }
      ]
    })
  ],
  base: './' // Ensure relative paths for assets
});