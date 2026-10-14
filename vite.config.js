import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/maison-wanel/' : '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  esbuild: {
    // Strip console/debugger in production builds.
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
