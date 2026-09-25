import { onUnmounted, ref, watch, type Ref } from 'vue'

/**
 * Animated count-up for a numeric source (e.g. contribution totals).
 * Starts the first time `source` becomes > 0; re-runs if it changes again.
 * Respects prefers-reduced-motion by jumping straight to the value.
 */

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useNumberTicker(source: Ref<number>, { duration = 1200 } = {}) {
  const display = ref(0)
  let rafId = 0

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  function run(to: number) {
    stop()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      display.value = to
      return
    }
    const from = display.value
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      display.value = Math.round(from + (to - from) * easeOutExpo(progress))
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        rafId = 0
      }
    }
    rafId = requestAnimationFrame(step)
  }

  watch(source, (value) => {
    if (value > 0) run(value)
  })

  onUnmounted(stop)

  return { display }
}
