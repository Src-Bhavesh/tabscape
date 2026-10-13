# Contributing to Tabscape

Thanks for wanting to help. Bug fixes, new backgrounds, new site categories, translations and ideas are all welcome.

## Talk first, for anything big

For a small fix, just open a pull request. For a new feature or a bigger change, open an issue or say hi on the [Discord](https://discord.gg/T5bF56tvyj) first, so we can agree on the approach before you spend time on it.

## Getting set up

You need Node 20 or newer.

```bash
git clone https://github.com/heyjeay/tabscape.git
cd tabscape
npm install
npm run dev
```

The page runs at http://localhost:5173 and reloads as you edit. To try it as a real extension:

```bash
npm run build:extension   # Chrome, Edge, Brave, Opera → dist-extension/
npm run build:firefox     # Firefox → dist-firefox/
```

Load `dist-extension` from `chrome://extensions` (Developer mode → **Load unpacked**), or `dist-firefox/manifest.json` from `about:debugging#/runtime/this-firefox` (**Load Temporary Add-on**).

## Where things live

| Path | What it is |
|---|---|
| `src/views/` | The new tab page (`Home.vue`) and the first-run setup (`Welcome.vue`) |
| `src/components/` | The customize panel, link sections, background picker, animated wallpaper |
| `src/composables/useStartpage.ts` | Saved links and settings: local storage and browser sync |
| `src/lib/wallpapers.ts`, `src/lib/scenes.ts` | Backgrounds: gradient wallpapers and the animated canvas scenes |
| `src/lib/catalog.ts` | The site categories offered in the setup |
| `src/site/` and `site/` | The website and live demo |
| `extension/` | The extension manifest (plus Firefox's extra settings) |

## A good pull request

- **One change per pull request.** It's easier to review and to undo.
- **Make sure it builds.** `npm run build:extension` runs the type checker as well as the build.
- **Try it in a browser,** ideally both Chrome and Firefox if you touched anything extension-related.
- **Keep it light.** Tabscape opens on every new tab: no new permissions, no network requests and no heavy dependencies without talking about it first. Animations should pause when the tab is hidden.
- **Keep it private.** No analytics, tracking or remote code. Ever.
- **Match the style around it.** Vue 3 with `<script setup>`, Tailwind for styling, short comments that say *why*.

## Licence

Tabscape is under the [GPL v3.0 or later](LICENSE). By sending a contribution, you agree it's shared under that same licence. The Tabscape name and logo aren't covered by the GPL; see [TRADEMARKS.md](TRADEMARKS.md).
