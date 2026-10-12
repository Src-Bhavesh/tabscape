<script setup lang="ts">
import { computed } from 'vue'
import { Check, ImagePlus, Sparkles } from 'lucide-vue-next'
import { useStartpage } from '@/composables/useStartpage'
import { WALLPAPERS, plainWallpaper, customWallpaper } from '@/lib/wallpapers'

/** The background grid: in the customize panel, and in the first-run setup. Classes go on the grid. */
defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{ tile?: string }>(), { tile: 'h-16' })

const { state } = useStartpage()
const settings = state.settings

const options = computed(() => [plainWallpaper, ...WALLPAPERS, customWallpaper(settings.customImage)])
</script>

<template>
  <div>
    <div class="grid gap-2" v-bind="$attrs">
      <button
        v-for="option in options"
        :key="option.id"
        class="group text-left"
        @click="settings.background = option.id"
      >
        <span
          class="relative block overflow-hidden rounded-md border transition-colors"
          :class="[tile, settings.background === option.id ? 'border-2 border-sky-400' : 'border-white/15 group-hover:border-white/40']"
          :style="{ background: option.background }"
        >
          <span
            v-if="option.id === 'custom' && !settings.customImage"
            class="absolute inset-0 grid place-items-center text-white/50"
          >
            <ImagePlus :size="18" />
          </span>
          <span
            v-if="option.scene || option.id === 'classic'"
            class="absolute bottom-1 left-1 rounded-full bg-black/45 p-0.5 text-white/85"
            title="Animated"
          >
            <Sparkles :size="10" />
          </span>
          <span
            v-if="settings.background === option.id"
            class="absolute right-1 top-1 rounded-full bg-sky-500 p-0.5 text-white"
          >
            <Check :size="11" />
          </span>
        </span>
        <span
          class="block px-0.5 pt-1 text-xs"
          :class="settings.background === option.id ? 'font-medium text-white' : 'text-white/60'"
        >{{ option.name }}</span>
      </button>
    </div>

    <!-- Lazy, so a half-typed address doesn't fetch on every key. -->
    <input
      v-if="settings.background === 'custom'"
      v-model.lazy.trim="settings.customImage"
      class="field mt-3 w-full"
      placeholder="Image or GIF address, then Enter"
      aria-label="Background image address"
    >
  </div>
</template>
