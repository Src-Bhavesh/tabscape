import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Adds the extension's manifest to the build (the icons come along from public/).
 * The manifest takes its version from package.json, so there's one number to bump.
 */
const chromeExtension = (): Plugin => ({
  name: 'chrome-extension',
  generateBundle() {
    const { version } = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'))
    const manifest = JSON.parse(readFileSync(path.resolve(__dirname, 'extension/manifest.json'), 'utf8'))
    this.emitFile({ type: 'asset', fileName: 'manifest.json', source: JSON.stringify({ ...manifest, version }, null, 2) })
  },
})

export default defineConfig(({ mode }) => {
  const extension = mode === 'extension'
  return {
    plugins: [
      vue(),
      // Two ways to ship the same page:
      // - extension: Chrome blocks inline scripts on extension pages, so the code stays in separate files.
      // - default: all the code inside index.html, since browsers won't load separate module
      //   scripts from file:// - this is what lets the page open with a double-click.
      extension ? chromeExtension() : viteSingleFile(),
    ],
    // Relative, so the build works from wherever it's loaded.
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: extension ? 'dist-extension' : 'dist',
      reportCompressedSize: false,
    },
    // Preview the extension build under the same script rules Chrome applies to extension pages.
    preview: extension
      ? { headers: { 'Content-Security-Policy': "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'" } }
      : {},
  }
})
