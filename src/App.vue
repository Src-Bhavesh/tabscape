<script setup lang="ts">
import StartLayout from '@/layout/StartLayout.vue'
import logo from '@/assets/logo.svg'

/** Built as the website's live demo: say so, and offer the way back. */
const preview = import.meta.env.MODE === 'site'
</script>

<template>
  <StartLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in" appear>
        <component :is="Component" />
      </Transition>
    </RouterView>

    <a
      v-if="preview"
      href="../"
      class="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-neutral-900/80 py-1.5 pl-1.5 pr-4 text-xs text-white/80 shadow-lg ring-1 ring-white/15 backdrop-blur-md transition hover:bg-neutral-800/90 hover:text-white"
    >
      <img :src="logo" alt="" class="h-6 w-6">
      Live preview of Tabscape · Get it
    </a>
  </StartLayout>
</template>
