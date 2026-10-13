<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowRight, Cloud, LayoutGrid, Palette, ShieldCheck, Sparkles, Wand2
} from 'lucide-vue-next'
import { siFirefoxbrowser, siGooglechrome } from 'simple-icons'
import AnimatedWallpaper from '@/components/AnimatedWallpaper.vue'
import BrandIcon from '@/components/BrandIcon.vue'
import { CHROME_STORE_URL, FIREFOX_STORE_URL } from '@/config'
import { findWallpaper } from '@/lib/wallpapers'
import logo from '@/assets/logo.svg'
import shotPage from '../../store/screenshots/1-new-tab.png'
import shotCustomize from '../../store/screenshots/2-customize.png'
import shotEdit from '../../store/screenshots/3-edit-links.png'
import shotSetup from '../../store/screenshots/4-setup.png'
import shotSearch from '../../store/screenshots/5-search-clock.png'

/** The website for Tabscape: what it is, a look at it, and the way into the live demo. */
const sky = findWallpaper('stars')

/** Where to get it. Whichever browser the visitor is using comes first. */
const STORES = [
  { name: 'Chrome', url: CHROME_STORE_URL, icon: siGooglechrome.path },
  { name: 'Firefox', url: FIREFOX_STORE_URL, icon: siFirefoxbrowser.path }
]
if (navigator.userAgent.includes('Firefox')) STORES.reverse()

const FEATURES = [
  { icon: Wand2, title: 'Set up in a minute', body: 'Pick from popular categories like gaming, streaming and AI, or start from a ready-made set. No account, no fuss.' },
  { icon: LayoutGrid, title: 'Your sites, your way', body: 'Rename sections, recolour them, and drag links wherever you like. Changes save as you type.' },
  { icon: Sparkles, title: 'Backgrounds that breathe', body: 'Starry nights, city lights, rain, fireflies and snow, drawn live and light on your computer.' },
  { icon: Palette, title: 'Make it yours', body: 'A greeting with your name, an optional clock and search box, and your links at the top, middle or bottom.' },
  { icon: Cloud, title: 'Follows you around', body: 'Sign into Chrome or Firefox on another computer and your new tab is already there, set up just how you left it.' },
  { icon: ShieldCheck, title: 'Private by design', body: 'No account, no servers, no tracking. Your setup lives in your browser and nowhere else.' }
]

const SHOTS = [
  { src: shotCustomize, title: 'Change the whole mood in a click', caption: 'Animated scenes, gradients, or your own picture, with dim and blur to keep links readable.' },
  { src: shotEdit, title: 'Edit right on the page', caption: 'Rename, recolour, add and drag. No settings pages to dig through.' },
  { src: shotSetup, title: 'A setup that asks what you use', caption: 'Choose whole categories or single sites. Your new tab is built from your answers.' },
  { src: shotSearch, title: 'Search and a clock, if you like', caption: 'Google, DuckDuckGo or Bing, right under your greeting.' }
]

const active = ref(0)
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden text-white">
    <!-- The same starry sky the extension opens on, alive behind the page. -->
    <div class="fixed inset-0 -z-20" :style="{ background: sky.background }">
      <AnimatedWallpaper v-if="sky.scene" :scene="sky.scene" :paused="false" />
    </div>
    <div class="fixed inset-0 -z-10 bg-black/30" />

    <header class="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <a href="./" class="flex items-center gap-2.5">
        <img :src="logo" alt="" class="h-9 w-9">
        <span class="text-xl font-semibold tracking-tight">Tabscape</span>
      </a>
      <nav class="flex items-center gap-1 text-sm text-white/70">
        <a href="#features" class="hidden rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white sm:block">Features</a>
        <a href="#look" class="hidden rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white sm:block">A closer look</a>
        <a href="#privacy" class="hidden rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white sm:block">Privacy</a>
        <a href="./demo/" class="ml-2 rounded-full bg-white/10 px-4 py-2 text-white ring-1 ring-white/15 transition hover:bg-white/20">Try it</a>
      </nav>
    </header>

    <main>
      <!-- Hero -->
      <section class="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center sm:pt-16">
        <h1 class="mx-auto max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          A new tab that feels like home.
        </h1>
        <p class="mx-auto mt-6 max-w-xl text-lg text-white/75 sm:text-xl">
          Your favourite sites, a friendly hello, and a night sky that moves. Every time you open a tab.
        </p>
        <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="./demo/"
            class="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-neutral-900 shadow-lg transition hover:bg-white/85"
          >
            Try it live <ArrowRight :size="18" />
          </a>
          <template v-for="store in STORES" :key="store.name">
            <a
              v-if="store.url"
              :href="store.url"
              class="flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-sky-400"
            >
              <BrandIcon :path="store.icon" :size="18" /> Add to {{ store.name }}
            </a>
            <span
              v-else
              class="flex items-center gap-2 rounded-full px-5 py-3 text-sm text-white/60 ring-1 ring-white/15"
            >
              <BrandIcon :path="store.icon" :size="16" /> {{ store.name }}: coming soon
            </span>
          </template>
        </div>
        <p class="mt-4 text-sm text-white/50">
          Free for Chrome and Firefox. Works in Edge, Brave and Opera too.
        </p>

        <div class="relative mx-auto mt-14 max-w-5xl">
          <div class="absolute -inset-6 -z-10 rounded-[2rem] bg-indigo-500/20 blur-3xl" />
          <div class="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
            <div class="flex items-center gap-1.5 bg-neutral-900/90 px-4 py-2.5">
              <span class="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span class="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span class="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span class="ml-3 rounded-md bg-white/10 px-3 py-0.5 text-xs text-white/50">New Tab</span>
            </div>
            <img :src="shotPage" alt="Tabscape: a greeting, the date and four columns of links over a starry sky" class="block w-full">
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" class="mx-auto max-w-6xl scroll-mt-6 px-5 py-16">
        <h2 class="text-center text-3xl font-bold sm:text-4xl">Everything a new tab should be</h2>
        <p class="mx-auto mt-3 max-w-lg text-center text-white/65">And nothing it shouldn't. No feeds, no ads, no news you didn't ask for.</p>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in FEATURES"
            :key="feature.title"
            class="rounded-2xl bg-white/[.06] p-6 ring-1 ring-white/10 backdrop-blur-md"
          >
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sky-300">
              <component :is="feature.icon" :size="20" />
            </span>
            <h3 class="mt-4 text-lg font-semibold">{{ feature.title }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-white/65">{{ feature.body }}</p>
          </div>
        </div>
      </section>

      <!-- Screenshots -->
      <section id="look" class="mx-auto max-w-6xl scroll-mt-6 px-5 py-16">
        <h2 class="text-center text-3xl font-bold sm:text-4xl">A closer look</h2>
        <div class="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_2fr]">
          <div class="space-y-2" role="tablist" aria-label="Screenshots">
            <button
              v-for="(shot, i) in SHOTS"
              :key="shot.title"
              role="tab"
              :aria-selected="active === i"
              class="block w-full rounded-xl p-4 text-left ring-1 transition"
              :class="active === i ? 'bg-white/10 ring-white/30' : 'ring-transparent hover:bg-white/5'"
              @click="active = i"
            >
              <span class="block font-semibold">{{ shot.title }}</span>
              <span class="mt-1 block text-sm text-white/60">{{ shot.caption }}</span>
            </button>
          </div>
          <div class="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
            <Transition name="fade" mode="out-in">
              <img :key="active" :src="SHOTS[active].src" :alt="SHOTS[active].title" class="block w-full">
            </Transition>
          </div>
        </div>
        <div class="mt-10 text-center">
          <a href="./demo/" class="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-neutral-900 shadow-lg transition hover:bg-white/85">
            See it for yourself <ArrowRight :size="18" />
          </a>
          <p class="mt-3 text-sm text-white/50">The live preview runs right here in your browser. Nothing to install.</p>
        </div>
      </section>

      <!-- Privacy: written plainly enough to serve as the store's privacy policy. -->
      <section id="privacy" class="mx-auto max-w-3xl scroll-mt-6 px-5 py-16">
        <div class="rounded-2xl bg-white/[.06] p-8 ring-1 ring-white/10 backdrop-blur-md">
          <h2 class="flex items-center gap-2.5 text-2xl font-bold"><ShieldCheck :size="24" class="text-emerald-300" /> Privacy</h2>
          <div class="mt-4 space-y-3 text-white/75">
            <p>Tabscape does not collect, sell or share any personal data. There are no accounts, no analytics and no servers.</p>
            <p>
              Your links and settings are stored in your browser. If "Sync across devices" is on, your browser copies them
              between your own computers through Chrome sync or Firefox Sync. That copy is handled by your browser, and it is never sent to us.
            </p>
            <p>Custom background images load straight from the address you give. You can export or delete your setup at any time from the customize panel.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-10 text-sm text-white/45">
      <span class="flex items-center gap-2"><img :src="logo" alt="" class="h-5 w-5"> Tabscape</span>
      <span>Made by Jeay · {{ new Date().getFullYear() }}</span>
    </footer>
  </div>
</template>
