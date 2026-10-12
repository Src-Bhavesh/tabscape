import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

export default defineConfig({
  // All the code goes inside index.html: browsers won't load separate module
  // scripts from file://, so this is what lets the page open with a double-click.
  plugins: [vue(), viteSingleFile()],
  // Relative, so the build works from the Pages subpath or anywhere else it is dropped.
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    reportCompressedSize: false,
  },
})
