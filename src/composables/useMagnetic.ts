import { onUnmounted, type Ref } from 'vue'

/**
 * Magnetic attraction: the element eases toward the pointer while it hovers
 * nearby and springs back when it leaves. Desktop pointers only; disabled
 * entirely under prefers-reduced-motion.
 */
export function useMagnetic(
  el: Ref<HTMLElement | null>,
  { strength = 0.35, radius = 140, lerpRate = 8 } = {},
) {
  let rafId = 0
  let prevT = 0
  let targetX = 0
  let targetY = 0
  let x = 0
  let y = 0
  let inside = false
  let listening = false

  const finePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  const reducedQuery =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

  function tick(now: number) {
    rafId = requestAnimationFrame(tick)
    const dt = Math.min(Math.max(now - prevT, 1) / 1000, 0.05)
    prevT = now
    const k = 1 - Math.exp(-lerpRate * dt)
    x += (targetX - x) * k
    y += (targetY - y) * k
    if (!inside && Math.abs(x) < 0.05 && Math.abs(y) < 0.05) {
      x = 0
      y = 0
      if (el.value) el.value.style.transform = ''
      cancelAnimationFrame(rafId)
      rafId = 0
      return
    }
    if (el.value) el.value.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
  }

  function ensureLoop() {
    if (!rafId) {
      prevT = performance.now()
      rafId = requestAnimationFrame(tick)
    }
  }

  function onMove(e: PointerEvent) {
    const node = el.value
    if (!node) return
    const rect = node.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist < radius) {
      inside = true
      targetX = dx * strength
      targetY = dy * strength
      ensureLoop()
    } else if (inside) {
      inside = false
      targetX = 0
      targetY = 0
      ensureLoop()
    }
  }

  function start() {
    if (listening || !finePointer || reducedQuery?.matches) return
    listening = true
    window.addEventListener('pointermove', onMove, { passive: true })
  }

  function stop() {
    if (!listening) return
    listening = false
    window.removeEventListener('pointermove', onMove)
    cancelAnimationFrame(rafId)
    rafId = 0
    if (el.value) el.value.style.transform = ''
  }

  start()

  onUnmounted(stop)

  return { stop }
}
