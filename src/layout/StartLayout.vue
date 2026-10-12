<script setup lang="ts">
import { computed } from 'vue'
import { useStartpage } from '@/composables/useStartpage'
import { findWallpaper } from '@/lib/wallpapers'
import AnimatedWallpaper from '@/components/AnimatedWallpaper.vue'

const { state } = useStartpage()

const wallpaper = computed(() => findWallpaper(state.settings.background, state.settings.customImage))
const dim = computed(() => (state.settings.dim < 0 ? wallpaper.value.scrim : state.settings.dim))
const blur = computed(() => (wallpaper.value.image ? state.settings.blur : 0))
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Keyed on the background itself, so picking another crossfades into it. -->
    <Transition name="fade">
      <div
        :key="wallpaper.background"
        class="fixed inset-0 -z-20 transition-[filter,transform] duration-300"
        :style="{
          background: wallpaper.background,
          filter: blur ? `blur(${blur}px)` : undefined,
          // Blur pulls the edges in; scale past them so no border shows.
          transform: blur ? 'scale(1.08)' : undefined
        }"
      >
        <AnimatedWallpaper v-if="wallpaper.scene" :scene="wallpaper.scene" :paused="!state.settings.animate" />
      </div>
    </Transition>
    <!-- Keeps the text readable whatever the background does underneath. -->
    <div
      class="fixed inset-0 -z-10 transition-colors duration-300"
      :style="{ backgroundColor: `rgb(0 0 0 / ${dim})` }"
    />
    <slot />
  </div>
</template>
