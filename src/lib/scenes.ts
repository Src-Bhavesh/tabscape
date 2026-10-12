/**
 * Animated wallpapers, drawn on a canvas over a CSS gradient.
 *
 * Kept cheap on purpose: every glow is a sprite rendered once and stamped
 * with drawImage, rain is a single stroked path, and stars are plain rects.
 * The canvas that runs these caps them at 30fps and stops when the tab is hidden.
 */
export type SceneId = 'city' | 'rain' | 'stars' | 'fireflies' | 'snow'

export interface Scene {
  /** Called on start and on every resize, in CSS pixels. */
  resize(w: number, h: number): void
  /** Advance by `dt` seconds and draw onto a cleared canvas. */
  draw(ctx: CanvasRenderingContext2D, dt: number): void
}

type RGB = [number, number, number]

const TAU = Math.PI * 2
const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)]
/** How many of something fit the screen at one per `area` square pixels, up to `max`. */
const fit = (w: number, h: number, area: number, max: number) => Math.min(max, Math.round((w * h) / area))

/** Grow or shrink a list to `n`, making new items as needed. */
const resizeList = <T>(list: T[], n: number, make: () => T) => {
  while (list.length < n) list.push(make())
  list.length = n
}

/** A soft disc, drawn once and stamped many times - far cheaper than a gradient per light per frame. */
const glowSprite = ([r, g, b]: RGB, core = 0.55): HTMLCanvasElement => {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const half = size / 2
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(core, `rgba(${r},${g},${b},.7)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return canvas
}

interface BokehOptions {
  palette: RGB[]
  /** Square pixels of screen per light. */
  area: number
  max: number
  radius: [number, number]
  alpha: [number, number]
  /** Pixels per second. */
  drift: number
  /** 0 spreads lights evenly; towards 1 gathers them low on the screen, like a city below. */
  low: number
}

interface Light {
  x: number
  y: number
  r: number
  a: number
  vx: number
  vy: number
  phase: number
  pulse: number
  sprite: HTMLCanvasElement
}

/** Out-of-focus lights drifting and breathing: the heart of the city and rain scenes. */
const bokeh = (o: BokehOptions): Scene => {
  const sprites = o.palette.map(c => glowSprite(c))
  const lights: Light[] = []
  let w = 0
  let h = 0

  const spawnY = () => h * (1 - Math.pow(Math.random(), 1 + o.low * 2))
  const make = (): Light => ({
    x: rand(0, w),
    y: spawnY(),
    r: rand(o.radius[0], o.radius[1]),
    a: rand(o.alpha[0], o.alpha[1]),
    vx: rand(-o.drift, o.drift),
    vy: rand(-o.drift, o.drift * 0.4),
    phase: rand(0, TAU),
    pulse: rand(0.3, 1.1),
    sprite: pick(sprites)
  })

  return {
    resize(nw, nh) {
      w = nw
      h = nh
      resizeList(lights, fit(w, h, o.area, o.max), make)
    },
    draw(ctx, dt) {
      ctx.globalCompositeOperation = 'lighter'
      for (const l of lights) {
        l.x += l.vx * dt
        l.y += l.vy * dt
        l.phase += l.pulse * dt
        if (l.x < -l.r) l.x = w + l.r
        else if (l.x > w + l.r) l.x = -l.r
        if (l.y < -l.r || l.y > h + l.r) {
          l.y = spawnY()
          l.x = rand(0, w)
        }
        ctx.globalAlpha = l.a * (0.7 + 0.3 * Math.sin(l.phase))
        ctx.drawImage(l.sprite, l.x - l.r, l.y - l.r, l.r * 2, l.r * 2)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }
  }
}

const WARM: RGB[] = [[255, 190, 110], [255, 150, 70], [255, 222, 160], [255, 120, 90]]
const COOL: RGB[] = [[140, 180, 255], [120, 220, 255], [200, 170, 255]]

/** City lights out of focus, warm and low, like the original GIF. */
const city = (): Scene => {
  const far = bokeh({ palette: WARM, area: 9000, max: 160, radius: [3, 10], alpha: [0.35, 0.8], drift: 2, low: 0.8 })
  const near = bokeh({ palette: [...WARM, ...WARM, COOL[0]], area: 26000, max: 60, radius: [18, 70], alpha: [0.12, 0.4], drift: 6, low: 0.6 })
  return {
    resize(w, h) { far.resize(w, h); near.resize(w, h) },
    draw(ctx, dt) { far.draw(ctx, dt); near.draw(ctx, dt) }
  }
}

interface Drop { x: number; y: number; len: number; speed: number }

/** Rain on a night street: streaks over blurred lights. */
const rain = (): Scene => {
  const lights = bokeh({ palette: [...COOL, WARM[0], WARM[2]], area: 22000, max: 70, radius: [14, 60], alpha: [0.12, 0.35], drift: 3, low: 0.5 })
  const SLANT = 0.12
  const layers = [
    { drops: [] as Drop[], area: 7000, max: 220, len: [8, 16], speed: [500, 700], style: 'rgba(190,210,255,.16)', width: 1 },
    { drops: [] as Drop[], area: 16000, max: 90, len: [16, 28], speed: [850, 1100], style: 'rgba(210,225,255,.3)', width: 1.4 }
  ]
  let w = 0
  let h = 0

  return {
    resize(nw, nh) {
      w = nw
      h = nh
      lights.resize(w, h)
      for (const layer of layers) {
        resizeList(layer.drops, fit(w, h, layer.area, layer.max), () => ({
          x: rand(-h * SLANT, w),
          y: rand(-h, h),
          len: rand(layer.len[0], layer.len[1]),
          speed: rand(layer.speed[0], layer.speed[1])
        }))
      }
    },
    draw(ctx, dt) {
      lights.draw(ctx, dt)
      for (const layer of layers) {
        ctx.strokeStyle = layer.style
        ctx.lineWidth = layer.width
        ctx.beginPath()
        for (const d of layer.drops) {
          d.y += d.speed * dt
          d.x += d.speed * SLANT * dt
          if (d.y - d.len > h) {
            d.y = rand(-60, 0)
            d.x = rand(-h * SLANT, w)
          }
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x - d.len * SLANT, d.y - d.len)
        }
        ctx.stroke()
      }
    }
  }
}

interface Star { x: number; y: number; s: number; a: number; phase: number; speed: number }
interface Meteor { x: number; y: number; vx: number; vy: number; life: number }

/** A slowly turning sky that twinkles, with the odd shooting star. */
const stars = (): Scene => {
  const list: Star[] = []
  let meteor: Meteor | null = null
  let nextMeteor = rand(3, 7)
  let w = 0
  let h = 0

  return {
    resize(nw, nh) {
      w = nw
      h = nh
      resizeList(list, fit(w, h, 2200, 600), () => ({
        x: rand(0, w),
        y: Math.pow(Math.random(), 1.4) * h,
        s: Math.random() < 0.1 ? rand(2, 3) : rand(1, 1.8),
        a: rand(0.55, 1),
        phase: rand(0, TAU),
        speed: rand(0.5, 2.5)
      }))
    },
    draw(ctx, dt) {
      ctx.fillStyle = '#fff'
      for (const s of list) {
        s.phase += s.speed * dt
        s.x += 2 * dt
        if (s.x > w) s.x = 0
        ctx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(s.phase))
        ctx.fillRect(s.x, s.y, s.s, s.s)
      }
      ctx.globalAlpha = 1

      nextMeteor -= dt
      if (!meteor && nextMeteor <= 0) {
        const angle = rand(0.35, 0.6)
        const speed = rand(700, 1000)
        meteor = { x: rand(w * 0.1, w * 0.8), y: rand(0, h * 0.35), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 }
        nextMeteor = rand(5, 12)
      }
      if (meteor) {
        meteor.x += meteor.vx * dt
        meteor.y += meteor.vy * dt
        meteor.life -= dt * 1.4
        const tail = 0.12
        const grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail)
        grad.addColorStop(0, `rgba(255,255,255,${Math.max(0, meteor.life)})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail)
        ctx.stroke()
        if (meteor.life <= 0) meteor = null
      }
    }
  }
}

interface Fly { x: number; y: number; r: number; heading: number; speed: number; phase: number; blink: number }

/** Fireflies wandering and blinking over a dark meadow. */
const fireflies = (): Scene => {
  const sprite = glowSprite([210, 255, 120], 0.25)
  const flies: Fly[] = []
  let w = 0
  let h = 0

  return {
    resize(nw, nh) {
      w = nw
      h = nh
      resizeList(flies, fit(w, h, 22000, 70), () => ({
        x: rand(0, w),
        y: rand(h * 0.25, h),
        r: rand(10, 22),
        heading: rand(0, TAU),
        speed: rand(10, 28),
        phase: rand(0, TAU),
        blink: rand(0.6, 1.4)
      }))
    },
    draw(ctx, dt) {
      ctx.globalCompositeOperation = 'lighter'
      for (const f of flies) {
        f.heading += rand(-1.5, 1.5) * dt
        f.x += Math.cos(f.heading) * f.speed * dt
        f.y += Math.sin(f.heading) * f.speed * dt
        f.phase += f.blink * dt
        if (f.x < -20) f.x = w + 20
        else if (f.x > w + 20) f.x = -20
        // Keep them near the ground: turn back when they climb too high or sink too low.
        if (f.y < h * 0.2) f.heading = Math.PI / 2
        else if (f.y > h + 10) f.heading = -Math.PI / 2
        const glow = Math.max(0, Math.sin(f.phase))
        ctx.globalAlpha = 0.15 + 0.85 * glow * glow
        ctx.drawImage(sprite, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }
  }
}

interface Flake { x: number; y: number; r: number; speed: number; sway: number; phase: number; a: number }

/** Snow falling in two depths, swaying as it goes. */
const snow = (): Scene => {
  const sprite = glowSprite([255, 255, 255], 0.45)
  const flakes: Flake[] = []
  let w = 0
  let h = 0

  return {
    resize(nw, nh) {
      w = nw
      h = nh
      resizeList(flakes, fit(w, h, 3500, 420), () => {
        const near = Math.random() < 0.2
        return {
          x: rand(0, w),
          y: rand(-h, h),
          r: near ? rand(5, 8) : rand(2, 4),
          speed: near ? rand(55, 90) : rand(20, 45),
          sway: rand(8, 26),
          phase: rand(0, TAU),
          a: near ? rand(0.6, 0.9) : rand(0.35, 0.7)
        }
      })
    },
    draw(ctx, dt) {
      for (const f of flakes) {
        f.y += f.speed * dt
        f.phase += dt * 0.8
        if (f.y - f.r > h) {
          f.y = -f.r
          f.x = rand(0, w)
        }
        const x = f.x + Math.sin(f.phase) * f.sway
        ctx.globalAlpha = f.a
        ctx.drawImage(sprite, x - f.r, f.y - f.r, f.r * 2, f.r * 2)
      }
      ctx.globalAlpha = 1
    }
  }
}

export const createScene = (id: SceneId): Scene =>
  ({ city, rain, stars, fireflies, snow })[id]()
