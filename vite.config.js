import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8000,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Prevents source code leakage in browser dev tools
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false, // Strips all comments in production
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
