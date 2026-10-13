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
  const site = mode === 'site'
  const OUT = { extension: 'dist-extension', site: 'dist-site' } as Record<string, string>
  return {
    // Three ways to ship the same page:
    // - extension: Chrome blocks inline scripts on extension pages, so the code stays in separate files.
    // - site: the website, a landing page at the root and the page itself as a live demo at /demo/.
    // - default: all the code inside index.html, since browsers won't load separate module
    //   scripts from file:// - this is what lets the page open with a double-click.
    plugins: [vue(), ...(extension ? [chromeExtension()] : site ? [] : [viteSingleFile()])],
    root: site ? path.resolve(__dirname, 'site') : __dirname,
    publicDir: path.resolve(__dirname, 'public'),
    // Relative, so every build works from wherever it's served or opened.
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // The site's pages live in site/, but its styles are configured here.
    css: { postcss: __dirname },
    build: {
      outDir: path.resolve(__dirname, OUT[mode] ?? 'dist'),
      emptyOutDir: true,
      reportCompressedSize: false,
      rollupOptions: site
        ? { input: { main: path.resolve(__dirname, 'site/index.html'), demo: path.resolve(__dirname, 'site/demo/index.html') } }
        : undefined,
    },
    // Preview the extension build under the same script rules Chrome applies to extension pages.
    preview: extension
      ? { headers: { 'Content-Security-Policy': "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'" } }
      : {},
  }
})
