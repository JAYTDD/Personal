import { onUnmounted, ref } from 'vue'

/**
 * Maps page scroll velocity to a small skew angle (deg) for kinetic
 * typography: the faster the scroll, the stronger the skew; it eases back
 * to 0 when scrolling stops. Respects prefers-reduced-motion (always 0).
 */
export function useScrollVelocity({ maxSkew = 8, factor = 0.9 } = {}) {
  const skew = ref(0)

  let rafId = 0
  let prevY = typeof window !== 'undefined' ? window.scrollY : 0
  let prevT = typeof window !== 'undefined' ? performance.now() : 0
  let lastT = prevT
  const reducedQuery =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

  let scrollY = prevY
  const onScroll = () => {
    scrollY = window.scrollY
  }

  function tick(now: number) {
    rafId = requestAnimationFrame(tick)
    const dt = Math.max((now - lastT) / 1000, 0.001)
    lastT = now

    let target = 0
    if (!reducedQuery?.matches) {
      const v = (scrollY - prevY) / dt / Math.max(window.innerHeight, 1) // screens/s
      prevY = scrollY
      target = Math.max(-1, Math.min(1, v * factor)) * maxSkew
    } else {
      prevY = scrollY
    }
    skew.value += (target - skew.value) * (1 - Math.exp(-6 * dt))
  }

  // keep the rAF only while the skew is meaningfully non-zero, restarting on scroll
  function ensureLoop() {
    if (!rafId) {
      prevT = performance.now()
      lastT = prevT
      rafId = requestAnimationFrame(tick)
    }
  }

  const onScrollWrapped = () => {
    onScroll()
    ensureLoop()
  }

  window.addEventListener('scroll', onScrollWrapped, { passive: true })
  ensureLoop()

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    rafId = 0
    window.removeEventListener('scroll', onScrollWrapped)
  })

  return skew
}
