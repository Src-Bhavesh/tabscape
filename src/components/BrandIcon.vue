<script setup lang="ts">
/** A one-colour brand mark from Simple Icons (CC0), drawn in the text colour. */
withDefaults(defineProps<{ path: string; size?: number; title?: string }>(), { size: 18 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor" :aria-label="title" :aria-hidden="!title" role="img">
    <path :d="path" />
  </svg>
</template>
