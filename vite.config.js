import { defineConfig } from 'vite';

// Host-agnostic build: relative base so /dist works at a domain root or a subpath.
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
    cssMinify: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Keep heavy libs in their own cacheable chunks. Three.js is also
        // dynamically imported (lazy) so it stays out of the initial payload.
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/lenis')) return 'lenis';
        },
      },
    },
  },
});
