import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Vite runs from the project root, and the repo is CommonJS, so avoid
// `import.meta.url` (it is only valid in ES modules).
const projectRoot = process.cwd();

export default defineConfig({
  // `react({})` (not `react()`): under NodeNext/CommonJS typings the package's
  // CJS export requires an explicit options object. Runtime behaviour is identical.
  plugins: [react({}), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  preview: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
