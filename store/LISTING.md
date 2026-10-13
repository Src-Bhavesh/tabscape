# Tabscape: Chrome Web Store listing

Copy these into the Developer Dashboard. Images are in this folder.

## Store listing

**Name:** Tabscape

**Summary** (132 characters max)

> Your links, a greeting and an animated night sky on every new tab. Pick your sites, choose a look, make it yours.

**Category:** Productivity

**Language:** English

**Description**

> Tabscape turns every new tab into a calm, good-looking start page with the sites you actually use.
>
> **Your links, your way**
> • Pick from popular categories on first run (streaming, gaming, social, AI, shopping and more), or start from a ready-made set
> • Rename sections, recolour them, add and remove links, and drag links between sections
> • Changes save as you type
>
> **A look you'll like**
> • Animated backgrounds drawn live: city lights, rain, starry night, fireflies and snowfall
> • Gradient wallpapers, or your own image or GIF
> • Dim and blur controls so your links always stay readable
> • Put everything at the top, centre or bottom of the screen
>
> **Little touches**
> • A greeting with your name, the date and an optional clock
> • An optional search box (Google, DuckDuckGo or Bing)
> • Open links in the same tab or a new one
>
> **Private by design**
> Everything stays in your browser. Tabscape asks for no permissions, has no account, and sends nothing anywhere. Export a backup file any time to keep your setup or move it to another computer.

## Graphics

| Field | File |
|---|---|
| Store icon (128×128) | `../public/icons/icon128.png` |
| Screenshots (1280×800) | `screenshots/1-new-tab.png` … `5-search-clock.png` |
| Small promo tile (440×280) | `promo-small-440x280.png` |
| Marquee promo tile (1400×560, optional) | `promo-marquee-1400x560.png` |

## Privacy practices tab

**Single purpose**

> Replaces the new tab page with a customisable start page showing the user's links, a greeting and a background they choose.

**Permission justification:** the extension requests no permissions. It only uses `chrome_url_overrides` to provide the new tab page.

**Remote code:** No, I am not using remote code. All scripts are packaged with the extension.

**Data usage:** tick nothing. Tabscape does not collect or transmit any user data. Links and settings are stored locally in the browser (`localStorage`) and never leave the device.

Then tick the three certifications (data not sold, not used for unrelated purposes, not used for creditworthiness).

**Privacy policy URL:** not required, since no user data is collected. If the dashboard asks for one anyway, a one-line policy works: "Tabscape does not collect, store remotely, or share any personal data. All settings stay on your device."

## Upload

Upload `tabscape-1.0.0.zip` from this folder. To make a new one after changes, bump `version` in `package.json`, then run `npm run build:extension` and zip the contents of `dist-extension/` (manifest at the top level of the zip).
