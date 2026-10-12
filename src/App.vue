<script setup lang="ts">
import StartLayout from '@/layout/StartLayout.vue'
</script>

<template>
  <StartLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in" appear>
        <component :is="Component" />
      </Transition>
    </RouterView>
  </StartLayout>
</template>
