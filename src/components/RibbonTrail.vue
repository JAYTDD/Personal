<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Point {
  x: number
  y: number
}

interface Ribbon {
  color: string
  width: number
  offset: number
  follow: number
  points: Point[]
}

const container = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const POINT_COUNT = 16
const IDLE_DELAY = 120
const FADE_DURATION = 500
const ribbons: Ribbon[] = [
  { color: '#EC4899', width: 2.5, offset: -3, follow: 0.24, points: [] },
  { color: '#8B5CF6', width: 3.5, offset: 3, follow: 0.19, points: [] },
]

let context: CanvasRenderingContext2D | null = null
let pointerQuery: MediaQueryList | null = null
let reducedQuery: MediaQueryList | null = null
let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let enabled = false
let inView = false
let inside = false
let initialized = false
let width = 0
let height = 0
let pixelRatio = 1
let frameId = 0
let previousFrame = 0
let lastMovement = 0
let leftAt = 0
let pointer: Point | null = null

function clear() {
  context?.clearRect(0, 0, width, height)
}

function stop() {
  cancelAnimationFrame(frameId)
  frameId = 0
  inside = false
  initialized = false
  pointer = null
  clear()
}

function canAnimate() {
  return enabled && inView && !document.hidden && width > 0 && height > 0 && context !== null
}

function resize() {
  const node = container.value
  const drawing = canvas.value
  if (!node || !drawing || !context) return

  width = node.clientWidth
  height = node.clientHeight
  pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  drawing.width = Math.ceil(width * pixelRatio)
  drawing.height = Math.ceil(height * pixelRatio)
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  stop()
}

function localPointer(): Point | null {
  const node = container.value
  if (!node || !pointer) return null

  // Read every frame: scrolling and the parent's reveal transform can move
  // the section even when no new pointer event has arrived.
  const rect = node.getBoundingClientRect()
  if (!rect.width || !rect.height) return null
  return {
    x: ((pointer.x - rect.left) / rect.width) * width,
    y: ((pointer.y - rect.top) / rect.height) * height,
  }
}

function drawRibbon(ribbon: Ribbon, alpha: number) {
  const ctx = context
  const first = ribbon.points[0]
  if (!ctx || !first) return

  ctx.beginPath()
  ctx.moveTo(first.x, first.y)
  for (let i = 1; i < ribbon.points.length - 1; i++) {
    const point = ribbon.points[i]!
    const next = ribbon.points[i + 1]!
    ctx.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2)
  }
  const last = ribbon.points[ribbon.points.length - 1]!
  ctx.lineTo(last.x, last.y)
  ctx.lineWidth = ribbon.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = ribbon.color
  ctx.globalAlpha = alpha
  ctx.stroke()
}

function tick(now: number) {
  frameId = 0
  if (!canAnimate()) {
    stop()
    return
  }

  const target = localPointer()
  if (!target) {
    stop()
    return
  }

  const fadeStart = inside ? lastMovement + IDLE_DELAY : leftAt
  const fade = Math.max(0, Math.min(1, (now - fadeStart) / FADE_DURATION))
  if (fade >= 1) {
    stop()
    return
  }

  const elapsed = Math.min(Math.max(now - previousFrame, 1), 50) / (1000 / 60)
  previousFrame = now
  clear()

  for (const ribbon of ribbons) {
    const head = ribbon.points[0]
    if (!head) continue
    const headFollow = 1 - Math.pow(1 - 0.5, elapsed)
    head.x += (target.x - head.x) * headFollow
    head.y += (target.y + ribbon.offset - head.y) * headFollow

    const follow = 1 - Math.pow(1 - ribbon.follow, elapsed)
    for (let i = 1; i < ribbon.points.length; i++) {
      const point = ribbon.points[i]!
      const previous = ribbon.points[i - 1]!
      point.x += (previous.x - point.x) * follow
      point.y += (previous.y - point.y) * follow
    }
    drawRibbon(ribbon, 0.22 * (1 - fade))
  }
  if (context) context.globalAlpha = 1
  frameId = requestAnimationFrame(tick)
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch' || !canAnimate()) return
  if (pointer && pointer.x === event.clientX && pointer.y === event.clientY) return

  pointer = { x: event.clientX, y: event.clientY }
  inside = true
  lastMovement = performance.now()

  if (!initialized) {
    const target = localPointer()
    if (!target) return
    for (const ribbon of ribbons) {
      ribbon.points = Array.from({ length: POINT_COUNT }, () => ({
        x: target.x,
        y: target.y + ribbon.offset,
      }))
    }
    initialized = true
  }

  if (!frameId) {
    previousFrame = lastMovement
    frameId = requestAnimationFrame(tick)
  }
}

function onPointerLeave() {
  if (!inside) return
  inside = false
  // Leaving during an idle fade must not brighten the trail again.
  leftAt = Math.min(performance.now(), lastMovement + IDLE_DELAY)
}

function onMediaChange() {
  enabled = Boolean(pointerQuery?.matches && !reducedQuery?.matches)
  stop()
}

function onVisibilityChange() {
  // Becoming visible never resumes old coordinates; wait for a new movement.
  stop()
}

onMounted(() => {
  context = canvas.value?.getContext('2d') ?? null
  if (!context || !container.value) return

  pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  pointerQuery.addEventListener('change', onMediaChange)
  reducedQuery.addEventListener('change', onMediaChange)
  document.addEventListener('visibilitychange', onVisibilityChange)
  onMediaChange()

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container.value)
  resize()

  intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false
    if (!inView) stop()
  })
  intersectionObserver.observe(container.value)
})

onUnmounted(() => {
  stop()
  pointerQuery?.removeEventListener('change', onMediaChange)
  reducedQuery?.removeEventListener('change', onMediaChange)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  intersectionObserver?.disconnect()
  resizeObserver?.disconnect()
  context = null
})
</script>

<template>
  <div
    ref="container"
    class="ribbon-trail"
    @pointermove.passive="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <canvas ref="canvas" class="ribbon-trail-canvas" aria-hidden="true" />
    <div class="ribbon-trail-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ribbon-trail {
  position: relative;
  isolation: isolate;
}

.ribbon-trail-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.ribbon-trail-content {
  position: relative;
  z-index: 1;
}
</style>
