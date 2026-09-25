<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Particle text morph: words rendered as a few thousand canvas particles
 * that spring toward their sampled positions, scatter away from the pointer
 * and morph between words on a fixed cycle. Pure 2D canvas, zero deps.
 *
 * Accessibility: the parent keeps a real <h1> (sr-only); this canvas is
 * aria-hidden decoration.
 */
const props = withDefaults(
  defineProps<{
    words: string[]
    /** ms between word morphs */
    interval?: number
  }>(),
  {
    interval: 4500,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapRef = ref<HTMLDivElement | null>(null)

const DPR = Math.min(window.devicePixelRatio || 1, 2)
const GAP = 4 // sampling step in reference px — keeps particle count bounded
const SPRING = 0.028
const FRICTION = 0.86
const REPEL_RADIUS = 110
const REPEL_FORCE = 5

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  size: number
  color: string
  /** eased toward lifeTarget — spawns fade in, surplus fades out */
  life: number
  lifeTarget: number
}

let particles: Particle[] = []
let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let running = false
let inView = true
let wordIndex = 0
let morphTimer: ReturnType<typeof setInterval> | null = null
let pointerX = -9999
let pointerY = -9999
let width = 0
let height = 0
const reducedQuery =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

// brand gradient stops left → right
const STOPS: Array<[number, [number, number, number]]> = [
  [0, [236, 72, 153]], // pink
  [0.5, [139, 92, 246]], // violet
  [1, [249, 115, 22]], // coral
]

function colorAt(t: number) {
  const v = Math.min(1, Math.max(0, t))
  let lo = STOPS[0]!
  let hi = STOPS[STOPS.length - 1]!
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i]!
    const b = STOPS[i + 1]!
    if (v >= a[0] && v <= b[0]) {
      lo = a
      hi = b
      break
    }
  }
  const span = hi[0] - lo[0] || 1
  const t2 = (v - lo[0]) / span
  const c = lo[1].map((ch, i) => Math.round(ch + (hi[1]![i]! - ch) * t2))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

/** Sample the current word into target points, in CSS-px reference space */
function sampleWord(word: string, fontSize: number): Array<[number, number]> {
  const off = document.createElement('canvas')
  const octx = off.getContext('2d', { willReadFrequently: true })
  if (!octx) return []
  octx.font = `700 ${fontSize}px Geist, ui-sans-serif, system-ui, sans-serif`
  const metrics = octx.measureText(word)
  off.width = Math.ceil(metrics.width) + 20
  off.height = Math.ceil(fontSize * 1.3)
  octx.font = `700 ${fontSize}px Geist, ui-sans-serif, system-ui, sans-serif`
  octx.fillStyle = '#fff'
  octx.textBaseline = 'middle'
  octx.fillText(word, 10, off.height / 2)

  const data = octx.getImageData(0, 0, off.width, off.height).data
  const points: Array<[number, number]> = []
  const offsetX = (width - off.width) / 2
  const offsetY = (height - off.height) / 2
  for (let y = 0; y < off.height; y += GAP) {
    for (let x = 0; x < off.width; x += GAP) {
      if (data[(y * off.width + x) * 4 + 3]! > 128) {
        points.push([offsetX + x, offsetY + y])
      }
    }
  }
  return points
}

function morphTo(word: string) {
  if (!ctx || !width) return
  const longest = props.words.reduce((a, b) => (b.length > a.length ? b : a), '')
  const fontSize = Math.max(48, Math.min(150, (width * 0.92) / (longest.length * 0.62)))
  const targets = sampleWord(word, fontSize)

  const old = particles
  particles = []
  const max = Math.max(old.length, targets.length)
  for (let i = 0; i < max; i++) {
    const t = targets[i % Math.max(targets.length, 1)]
    const prev = old[i]
    if (t && i < targets.length) {
      const spawned = !prev
      particles.push({
        x: prev ? prev.x : t[0] + (Math.random() - 0.5) * 240,
        y: prev ? prev.y : t[1] + (Math.random() - 0.5) * 240,
        vx: prev ? prev.vx * 0.5 : 0,
        vy: prev ? prev.vy * 0.5 : 0,
        tx: t[0],
        ty: t[1],
        size: 1.6,
        color: colorAt(t[0] / Math.max(width, 1)),
        life: spawned ? 0 : prev!.life,
        lifeTarget: 1,
      })
    } else if (prev) {
      // surplus particle: drift down and fade away
      particles.push({
        ...prev,
        tx: prev.x,
        ty: prev.y + 60,
        lifeTarget: 0,
      })
    }
  }
}

function resize() {
  const wrap = wrapRef.value
  const canvas = canvasRef.value
  if (!wrap || !canvas) return
  width = wrap.clientWidth
  height = wrap.clientHeight
  canvas.width = width * DPR
  canvas.height = height * DPR
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d')
  ctx?.setTransform(DPR, 0, 0, DPR, 0, 0)
  morphTo(props.words[wordIndex]!)
}

function tick() {
  rafId = requestAnimationFrame(tick)
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    // spring toward target
    p.vx += (p.tx - p.x) * SPRING
    p.vy += (p.ty - p.y) * SPRING
    // pointer repulsion
    const dx = p.x - pointerX
    const dy = p.y - pointerY
    const distSq = dx * dx + dy * dy
    if (distSq < REPEL_RADIUS * REPEL_RADIUS) {
      const dist = Math.sqrt(distSq) || 1
      const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE
      p.vx += (dx / dist) * force
      p.vy += (dy / dist) * force
    }
    p.vx *= FRICTION
    p.vy *= FRICTION
    p.x += p.vx
    p.y += p.vy

    p.life += (p.lifeTarget - p.life) * 0.08
    if (p.life < 0.02 && p.lifeTarget === 0) continue

    ctx.globalAlpha = Math.min(1, p.life)
    ctx.fillStyle = p.color
    ctx.fillRect(p.x, p.y, p.size, p.size)
  }
  ctx.globalAlpha = 1

  if (particles.some((p) => p.lifeTarget === 0 && p.life < 0.05)) {
    particles = particles.filter((p) => p.lifeTarget === 1 || p.life >= 0.05)
  }
}

function startLoop() {
  if (running) return
  running = true
  rafId = requestAnimationFrame(tick)
}

function stopLoop() {
  running = false
  cancelAnimationFrame(rafId)
}

function onPointerMove(e: PointerEvent) {
  const rect = wrapRef.value?.getBoundingClientRect()
  if (!rect) return
  pointerX = e.clientX - rect.left
  pointerY = e.clientY - rect.top
}

function onPointerLeave() {
  pointerX = -9999
  pointerY = -9999
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  resize()
  if (reducedQuery?.matches) {
    // static render: draw the word once, no loop, no interactions
    morphTo(props.words[0]!)
    if (ctx) {
      for (const p of particles) {
        p.x = p.tx
        p.y = p.ty
        ctx.globalAlpha = 1
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
      ctx.globalAlpha = 1
    }
    window.addEventListener('resize', resize, { passive: true })
    return
  }

  startLoop()
  morphTimer = setInterval(() => {
    wordIndex = (wordIndex + 1) % props.words.length
    morphTo(props.words[wordIndex]!)
  }, props.interval)
  window.addEventListener('resize', resize, { passive: true })
  wrapRef.value?.addEventListener('pointermove', onPointerMove)
  wrapRef.value?.addEventListener('pointerleave', onPointerLeave)
  if (wrapRef.value) {
    observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (inView) startLoop()
      else stopLoop()
    })
    observer.observe(wrapRef.value)
  }
})

onUnmounted(() => {
  stopLoop()
  if (morphTimer) clearInterval(morphTimer)
  observer?.disconnect()
  observer = null
  window.removeEventListener('resize', resize)
  wrapRef.value?.removeEventListener('pointermove', onPointerMove)
  wrapRef.value?.removeEventListener('pointerleave', onPointerLeave)
})
</script>

<template>
  <div ref="wrapRef" class="particle-text" aria-hidden="true">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.particle-text {
  width: 100%;
  height: clamp(96px, 14vw, 168px);
  position: relative;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
