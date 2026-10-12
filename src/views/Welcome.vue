<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Check, Upload, X } from 'lucide-vue-next'
import WallpaperPicker from '@/components/WallpaperPicker.vue'
import { useStartpage } from '@/composables/useStartpage'
import { CATALOG, type Category } from '@/lib/catalog'
import { gradientCss } from '@/lib/gradients'
import { uid, type Section } from '@/lib/defaults'

const router = useRouter()
const { state, importData, completeWelcome } = useStartpage()
const settings = state.settings

/** Run again from the customize panel, rather than a first visit. */
const rerun = state.welcomed

const STEPS = ['Welcome', 'Your sites', 'Your look']
const step = ref(0)
const notice = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

/** Picked site names per category id. Starts empty: they choose, rather than prune our choices. */
const picked = ref<Record<string, string[]>>({})

const isPicked = (c: Category, name: string) => picked.value[c.id]?.includes(name) ?? false
const pickedCount = (c: Category) => picked.value[c.id]?.length ?? 0

/** A whole category: take all of it, or none of it if any was picked. */
const toggleCategory = (c: Category) => {
  picked.value[c.id] = pickedCount(c) ? [] : c.links.map(([name]) => name)
}

const toggleLink = (c: Category, name: string) => {
  const current = picked.value[c.id] ?? []
  picked.value[c.id] = current.includes(name) ? current.filter(n => n !== name) : [...current, name]
}

const totals = computed(() => {
  const counts = CATALOG.map(pickedCount).filter(Boolean)
  return { sites: counts.reduce((a, b) => a + b, 0), sections: counts.length }
})

/** The chosen categories as sections, in catalogue order, each keeping its sites' order. */
const buildSections = (): Section[] =>
  CATALOG.filter(c => pickedCount(c)).map(c => ({
    id: uid(),
    title: c.title,
    gradient: [...c.gradient],
    links: c.links.filter(([name]) => isPicked(c, name)).map(([name, url]) => ({ id: uid(), name, url }))
  }))

const goHome = () => router.replace({ name: 'home' })

const finish = () => {
  completeWelcome(buildSections())
  goHome()
}

const useClassic = () => {
  completeWelcome()
  goHome()
}

const restore = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    importData(await file.text())
    completeWelcome(state.sections)
    goHome()
  } catch {
    notice.value = "That file isn't a startpage export."
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="relative w-full max-w-4xl rounded-2xl bg-neutral-950/55 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-10">
      <button
        v-if="rerun"
        class="icon-btn absolute right-4 top-4"
        title="Cancel setup"
        aria-label="Cancel setup"
        @click="goHome"
      >
        <X :size="18" />
      </button>

      <!-- Where they are. -->
      <ol class="mb-8 flex items-center justify-center gap-2 text-xs text-white/45">
        <li v-for="(label, i) in STEPS" :key="label" class="flex items-center gap-2">
          <span
            class="grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold transition-colors"
            :class="i < step ? 'bg-sky-500 text-white' : i === step ? 'bg-white text-neutral-900' : 'bg-white/10'"
          >
            <Check v-if="i < step" :size="12" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="hidden sm:inline" :class="i === step ? 'text-white' : ''">{{ label }}</span>
          <span v-if="i < STEPS.length - 1" class="mx-1 h-px w-6 bg-white/20 sm:w-10" />
        </li>
      </ol>

      <Transition name="step" mode="out-in">
        <!-- 1. Hello. -->
        <section v-if="step === 0" key="intro" class="text-center">
          <h1 class="m-0 text-[48px] font-bold leading-tight sm:text-[60px]">Welcome.</h1>
          <p class="mx-auto mt-3 max-w-lg text-white/70">
            Let's set up your new tab. Pick the sites you actually use and a look you like. It takes a minute,
            and you can change any of it later from the corner of the page.
          </p>

          <label class="mx-auto mt-8 block max-w-sm text-left">
            <span class="text-sm text-white/60">What should we call you? <span class="text-white/35">(optional)</span></span>
            <input
              v-model="settings.name"
              class="field mt-1.5 w-full !px-3 !py-2 !text-base"
              placeholder="Your name"
              autofocus
              @keydown.enter="step = 1"
            >
          </label>

          <button
            class="mx-auto mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-medium text-neutral-900 shadow-lg transition hover:bg-white/85"
            @click="step = 1"
          >
            Get started <ArrowRight :size="17" />
          </button>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/50">
            <button class="underline-offset-4 transition hover:text-white hover:underline" @click="useClassic">
              Skip, use the classic set
            </button>
            <span aria-hidden="true">·</span>
            <button class="flex items-center gap-1 underline-offset-4 transition hover:text-white hover:underline" @click="fileInput?.click()">
              <Upload :size="13" /> Restore a backup
            </button>
            <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="restore">
          </div>
          <p v-if="notice" class="mt-3 text-sm text-red-300">{{ notice }}</p>
        </section>

        <!-- 2. What they use. -->
        <section v-else-if="step === 1" key="sites">
          <div class="text-center">
            <h2 class="m-0 text-3xl font-bold">What do you use?</h2>
            <p class="mt-2 text-white/60">Tap a category to add all of it, or pick sites one by one.</p>
            <p v-if="rerun" class="mt-1 text-xs text-amber-200/80">
              Finishing replaces your current links. Export a backup first if you want to keep them.
            </p>
          </div>

          <div class="-mx-1 mt-6 grid max-h-[52vh] gap-3 overflow-y-auto px-1 py-1 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="category in CATALOG"
              :key="category.id"
              class="rounded-xl p-4 ring-1 transition"
              :class="pickedCount(category) ? 'bg-white/10 ring-white/35' : 'bg-white/[.03] ring-white/10 hover:bg-white/[.06]'"
            >
              <button class="flex w-full items-center justify-between text-left" @click="toggleCategory(category)">
                <span>
                  <span class="gradient-text text-xl font-bold" :style="{ backgroundImage: gradientCss(category.gradient) }">
                    {{ category.title }}
                  </span>
                  <span class="mt-1 block h-[3px] w-24" :style="{ backgroundImage: gradientCss(category.gradient) }" />
                </span>
                <span
                  class="grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 transition"
                  :class="pickedCount(category) ? 'bg-sky-500 ring-sky-400' : 'ring-white/25'"
                >
                  <Check v-if="pickedCount(category)" :size="13" />
                </span>
              </button>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <button
                  v-for="[name] in category.links"
                  :key="name"
                  class="rounded-full px-2.5 py-1 text-xs ring-1 transition"
                  :class="isPicked(category, name)
                    ? 'bg-white/20 text-white ring-white/30'
                    : 'text-white/45 ring-white/10 hover:text-white/80 hover:ring-white/25'"
                  :aria-pressed="isPicked(category, name)"
                  @click="toggleLink(category, name)"
                >
                  {{ name }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3">
            <button class="flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white" @click="step = 0">
              <ArrowLeft :size="16" /> Back
            </button>
            <span class="text-sm text-white/50">
              <template v-if="totals.sites">{{ totals.sites }} site{{ totals.sites === 1 ? '' : 's' }} in {{ totals.sections }} section{{ totals.sections === 1 ? '' : 's' }}</template>
              <template v-else>Pick at least one site</template>
            </span>
            <button
              class="flex items-center gap-2 rounded-full bg-white px-5 py-2 font-medium text-neutral-900 shadow-lg transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="!totals.sites"
              @click="step = 2"
            >
              Next <ArrowRight :size="17" />
            </button>
          </div>
        </section>

        <!-- 3. How it looks. -->
        <section v-else key="look">
          <div class="text-center">
            <h2 class="m-0 text-3xl font-bold">Pick a look</h2>
            <p class="mt-2 text-white/60">It previews behind this card. The sparkly ones are animated.</p>
          </div>

          <WallpaperPicker class="mt-6 grid-cols-3 sm:grid-cols-5" tile="h-20" />

          <div class="mt-8 flex items-center justify-between gap-3">
            <button class="flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white" @click="step = 1">
              <ArrowLeft :size="16" /> Back
            </button>
            <button
              class="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-medium text-neutral-900 shadow-lg transition hover:bg-white/85"
              @click="finish"
            >
              Open my new tab <ArrowRight :size="17" />
            </button>
          </div>
        </section>
      </Transition>
    </div>
  </main>
</template>
