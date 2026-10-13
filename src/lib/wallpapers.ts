/**
 * Backgrounds for the page. The gradients are Brink's new tab wallpapers,
 * ported as-is so the two look of a piece; animated scenes from lib/scenes
 * and a custom image sit alongside them.
 *
 * A scrim is laid over the top to keep white text readable - heavier on the
 * light ones, where it would otherwise be white on near-white.
 */
import type { SceneId } from './scenes'

export interface Wallpaper {
  id: string
  name: string
  /** The CSS `background` shorthand, layered front to back. */
  background: string
  /** How dark a veil the page lays over it, 0 to 1. */
  scrim: number
  /** An image rather than a gradient: these can be blurred. */
  image?: boolean
  /** Drawn and animated on a canvas over `background`. */
  scene?: SceneId
}

/** What the page falls back to when nothing else is drawn. */
export const PLAIN = '#202125'

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'city',
    name: 'City Lights',
    scrim: 0.12,
    scene: 'city',
    background: `radial-gradient(ellipse 140% 55% at 50% 108%, rgba(255,145,60,.35), transparent 65%),
       radial-gradient(ellipse 80% 40% at 50% 0%, rgba(60,70,140,.35), transparent 70%),
       linear-gradient(180deg, #07080f, #141322 55%, #22170f)`
  },
  {
    id: 'rain',
    name: 'Rain',
    scrim: 0.12,
    scene: 'rain',
    background: `radial-gradient(ellipse 120% 50% at 50% 110%, rgba(90,130,200,.35), transparent 65%),
       linear-gradient(180deg, #05070d, #0c1424 60%, #111a2a)`
  },
  {
    id: 'stars',
    name: 'Starry Night',
    scrim: 0.05,
    scene: 'stars',
    background: `radial-gradient(ellipse 120% 60% at 50% 120%, rgba(56,78,160,.45), transparent 60%),
       radial-gradient(ellipse 60% 40% at 80% 10%, rgba(120,80,200,.18), transparent 70%),
       linear-gradient(180deg, #010208, #050816 60%, #0b1030)`
  },
  {
    id: 'fireflies',
    name: 'Fireflies',
    scrim: 0.05,
    scene: 'fireflies',
    background: `radial-gradient(ellipse 120% 60% at 50% 115%, rgba(30,90,50,.55), transparent 65%),
       radial-gradient(ellipse 70% 40% at 30% 0%, rgba(40,60,90,.3), transparent 70%),
       linear-gradient(180deg, #03080a, #071510 60%, #0b1f14)`
  },
  {
    id: 'snow',
    name: 'Snowfall',
    scrim: 0.15,
    scene: 'snow',
    background: `radial-gradient(ellipse 100% 60% at 50% 0%, rgba(120,150,200,.3), transparent 70%),
       linear-gradient(180deg, #0d1422, #1a2436 60%, #26324a)`
  },
  {
    id: 'aurora',
    name: 'Aurora',
    scrim: 0.2,
    background: `radial-gradient(ellipse 70% 50% at 20% 20%, rgba(19,87,189,.8), transparent 60%),
       radial-gradient(ellipse 60% 60% at 85% 35%, rgba(115,226,250,.45), transparent 60%),
       radial-gradient(ellipse 80% 50% at 50% 95%, rgba(37,99,235,.55), transparent 60%),
       linear-gradient(180deg, #08101c, #0d1a2e 60%, #08101c)`
  },
  {
    id: 'sunset',
    name: 'Sunset',
    scrim: 0.25,
    background: `radial-gradient(ellipse 90% 60% at 50% 100%, rgba(251,146,60,.9), transparent 65%),
       radial-gradient(ellipse 70% 50% at 20% 30%, rgba(244,63,94,.7), transparent 60%),
       linear-gradient(180deg, #1e0b2e, #4c1d4b 50%, #2a0f1f)`
  },
  {
    id: 'ocean',
    name: 'Ocean',
    scrim: 0.2,
    background: `radial-gradient(ellipse 80% 60% at 70% 20%, rgba(56,189,248,.7), transparent 60%),
       radial-gradient(ellipse 70% 50% at 20% 90%, rgba(20,184,166,.7), transparent 60%),
       linear-gradient(180deg, #061427, #0b2a4a 60%, #061427)`
  },
  {
    id: 'forest',
    name: 'Forest',
    scrim: 0.2,
    background: `radial-gradient(ellipse 80% 50% at 30% 10%, rgba(132,204,22,.55), transparent 60%),
       radial-gradient(ellipse 70% 50% at 80% 80%, rgba(16,185,129,.6), transparent 60%),
       linear-gradient(180deg, #06140d, #0d2a1c 60%, #06140d)`
  },
  {
    id: 'midnight',
    name: 'Midnight',
    scrim: 0.1,
    background: `radial-gradient(ellipse 50% 40% at 50% 0%, rgba(99,102,241,.5), transparent 60%),
       linear-gradient(180deg, #05050a, #0f0f1c 70%, #05050a)`
  },
  {
    id: 'mesh',
    name: 'Mesh',
    scrim: 0.35,
    background: `radial-gradient(at 10% 10%, #f472b6 0, transparent 50%),
       radial-gradient(at 90% 15%, #818cf8 0, transparent 50%),
       radial-gradient(at 15% 85%, #34d399 0, transparent 50%),
       radial-gradient(at 85% 90%, #fbbf24 0, transparent 50%),
       #1f1f2e`
  },
  {
    id: 'graphite',
    name: 'Graphite',
    scrim: 0.1,
    background: `radial-gradient(ellipse 80% 60% at 50% 120%, rgba(255,255,255,.12), transparent 60%),
       linear-gradient(160deg, #2a2a33, #111116 60%, #1b1b22)`
  },
  {
    id: 'paper',
    name: 'Paper',
    scrim: 0.5,
    background: `radial-gradient(ellipse 70% 50% at 30% 20%, rgba(255,255,255,.9), transparent 60%),
       radial-gradient(ellipse 60% 60% at 80% 80%, rgba(196,181,253,.6), transparent 60%),
       linear-gradient(180deg, #e9e6f7, #d9e6ff 60%, #efe9ff)`
  }
]

export const plainWallpaper: Wallpaper = { id: 'none', name: 'Plain', scrim: 0, background: PLAIN }

/** A wallpaper for a custom image URL, drawn like the original GIF. */
export const customWallpaper = (url: string): Wallpaper => ({
  id: 'custom',
  name: 'Image',
  scrim: 0.25,
  image: true,
  // JSON.stringify quotes and escapes the URL, so a stray ) or " can't break out of url().
  background: url.trim() ? `url(${JSON.stringify(url.trim())}) center / cover no-repeat, ${PLAIN}` : PLAIN
})

/** The background a first visit gets, and where an unknown or retired one falls back to. */
export const DEFAULT_WALLPAPER = 'stars'

export const findWallpaper = (id: string, customUrl = ''): Wallpaper => {
  if (id === 'custom') return customWallpaper(customUrl)
  if (id === 'none') return plainWallpaper
  return WALLPAPERS.find(w => w.id === id) ?? WALLPAPERS.find(w => w.id === DEFAULT_WALLPAPER)!
}
