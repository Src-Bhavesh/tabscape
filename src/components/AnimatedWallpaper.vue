<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createScene, type Scene, type SceneId } from '@/lib/scenes'
import { log } from '@/config'

const props = defineProps<{ scene: SceneId; paused: boolean }>()

/** A wallpaper doesn't need more; halving the frames halves the work. */
const FRAME_MS = 1000 / 30
/** The glows are soft anyway - drawing them at full Retina resolution buys nothing. */
const MAX_DPR = 1.5

const canvas = ref<HTMLCanvasElement | null>(null)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let scene: Scene | null = null
let ctx: CanvasRenderingContext2D | null = null
let observer: ResizeObserver | null = null
let raf = 0
let last = 0
let width = 0
let height = 0

const render = (dt: number) => {
  if (!ctx || !scene) return
  ctx.clearRect(0, 0, width, height)
  scene.draw(ctx, dt)
}

// requestAnimationFrame stops by itself while the tab is hidden, so a background tab costs nothing.
const loop = (t: number) => {
  raf = requestAnimationFrame(loop)
  if (t - last < FRAME_MS - 2) return
  // After a pause, step a little rather than jumping everything across the screen.
  const dt = last ? Math.min((t - last) / 1000, 0.1) : 0
  last = t
  render(dt)
}

const start = () => {
  if (raf || props.paused || reducedMotion) return
  last = 0
  raf = requestAnimationFrame(loop)
  log('wallpaper animation started', props.scene)
}

const stop = () => {
  cancelAnimationFrame(raf)
  raf = 0
}

const resize = () => {
  const el = canvas.value
  if (!el || !ctx || !scene) return
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  width = el.clientWidth
  height = el.clientHeight
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  scene.resize(width, height)
  // Resizing clears the canvas. Draw a still now rather than waiting on a frame
  // that may never come (paused, reduced motion, or opened in a background tab).
  render(0)
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  ctx = el.getContext('2d')
  scene = createScene(props.scene)
  observer = new ResizeObserver(resize)
  observer.observe(el)
  resize()
  start()
})

watch(() => props.paused, paused => (paused ? stop() : start()))

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
  observer = null
  scene = null
  ctx = null
})
</script>

<template>
  <canvas ref="canvas" class="absolute inset-0 h-full w-full" aria-hidden="true" />
</template>
