import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * The current time, updated on each minute boundary. Nothing on the page
 * shows seconds, so one wake-up a minute is all it needs.
 */
export const useNow = () => {
  const now = ref(new Date())
  let timer: ReturnType<typeof setTimeout> | undefined

  const schedule = () => {
    const d = new Date()
    const untilNextMinute = 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds())
    timer = setTimeout(() => {
      now.value = new Date()
      schedule()
    }, untilNextMinute + 50)
  }

  // A tab left in the background has its timers throttled; catch up when it comes back.
  const onVisible = () => {
    if (document.visibilityState === 'visible') now.value = new Date()
  }

  onMounted(() => {
    schedule()
    document.addEventListener('visibilitychange', onVisible)
  })
  onBeforeUnmount(() => {
    clearTimeout(timer)
    document.removeEventListener('visibilitychange', onVisible)
  })

  return now
}
