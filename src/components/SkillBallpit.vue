<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getIcon, replaceIDs } from '@iconify/vue'

/**
 * 兴趣游乐场: a 2D-physics ball pit. Hobby chips fall, pile up, collide and
 * can be grabbed and thrown with the pointer. Zero deps — custom impulse
 * physics in a rAF loop, gated by IntersectionObserver.
 */
export interface PitItem {
  name: string
  icon: string
  color: string
}

const props = withDefaults(
  defineProps<{
    items: PitItem[]
    /** unlabeled filler balls for liveliness */
    fillerCount?: number
  }>(),
  { fillerCount: 8 },
)

const wrapRef = ref<HTMLElement | null>(null)
const FILLER_COLORS = ['#3F3F46', '#52525B', '#71717A', '#EC4899', '#8B5CF6', '#F97316', '#22D3EE', '#4ADE80']

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  icon?: string
  label?: string
  el: HTMLElement
}

let balls: Ball[] = []
let rafId = 0
let inView = false
let running = false
let width = 0
let height = 0
let grabIndex = -1
let grabOffX = 0
let grabOffY = 0
let lastT = 0
const reducedQuery =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

const GRAVITY = 1100
const RESTITUTION = 0.72
const AIR = 0.999
const SLEEP = 8 // px/s under which a resting ball stops jittering

function setup() {
  const wrap = wrapRef.value
  if (!wrap) return
  // clear previous balls (resize)
  for (const b of balls) b.el.remove()
  balls = []
  width = wrap.clientWidth
  height = wrap.clientHeight

  const defs: Array<Pick<Ball, 'color' | 'icon' | 'label'>> = props.items.map((it) => ({
    color: it.color,
    icon: it.icon,
    label: it.name,
  }))
  for (let i = 0; i < props.fillerCount; i++) {
    defs.push({ color: FILLER_COLORS[i % FILLER_COLORS.length]! })
  }

  defs.forEach((def, i) => {
    const r = def.label ? 26 + Math.min(10, def.label.length * 1.2) : 14 + Math.random() * 8
    const el = document.createElement('div')
    el.className = 'pit-ball'
    el.style.setProperty('--ball-color', def.color)
    if (def.label) el.classList.add('has-label')
    if (def.icon) {
      const span = document.createElement('span')
      span.className = 'pit-icon'
      const iconData = getIcon(def.icon)
      if (iconData) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute(
          'viewBox',
          `${iconData.left || 0} ${iconData.top || 0} ${iconData.width} ${iconData.height}`,
        )
        svg.setAttribute('width', '14')
        svg.setAttribute('height', '14')
        svg.setAttribute('aria-hidden', 'true')
        svg.style.color = def.color
        svg.innerHTML = replaceIDs(iconData.body)
        span.appendChild(svg)
      }
      el.appendChild(span)
    }
    if (def.label) {
      const label = document.createElement('span')
      label.className = 'pit-label'
      label.textContent = def.label
      el.appendChild(label)
    }
    wrap.appendChild(el)
    balls.push({
      x: r + Math.random() * Math.max(width - r * 2, 1),
      y: -40 - i * (r * 2.4),
      vx: (Math.random() - 0.5) * 60,
      vy: 0,
      r,
      color: def.color,
      icon: def.icon,
      label: def.label,
      el,
    })
  })
}

function physics(dt: number) {
  const steps = 2
  const h = dt / steps
  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i]!
      if (i === grabIndex) continue
      b.vy += GRAVITY * h
      b.vx *= AIR
      b.x += b.vx * h
      b.y += b.vy * h

      // walls
      if (b.x - b.r < 0) {
        b.x = b.r
        b.vx = Math.abs(b.vx) * RESTITUTION
      } else if (b.x + b.r > width) {
        b.x = width - b.r
        b.vx = -Math.abs(b.vx) * RESTITUTION
      }
      if (b.y + b.r > height) {
        b.y = height - b.r
        b.vy = -Math.abs(b.vy) * RESTITUTION
        b.vx *= 0.96 // ground friction
        if (Math.abs(b.vy) < SLEEP) b.vy = 0
      } else if (b.y - b.r < 0) {
        b.y = b.r
        b.vy = Math.abs(b.vy) * RESTITUTION
      }
    }

    // ball ↔ ball impulses
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i]!
        const b = balls[j]!
        const dx = b.x - a.x
        const dy = b.y - a.y
        const distSq = dx * dx + dy * dy
        const min = a.r + b.r
        if (distSq >= min * min || distSq === 0) continue
        const dist = Math.sqrt(distSq)
        const nx = dx / dist
        const ny = dy / dist
        const overlap = min - dist
        a.x -= nx * overlap * 0.5
        a.y -= ny * overlap * 0.5
        b.x += nx * overlap * 0.5
        b.y += ny * overlap * 0.5
        const rvx = b.vx - a.vx
        const rvy = b.vy - a.vy
        const vn = rvx * nx + rvy * ny
        if (vn > 0) continue
        const imp = -vn * 0.5 * (1 + RESTITUTION)
        a.vx -= nx * imp
        a.vy -= ny * imp
        b.vx += nx * imp
        b.vy += ny * imp
      }
    }
  }
}

function render() {
  for (const b of balls) {
    b.el.style.transform = `translate3d(${(b.x - b.r).toFixed(1)}px, ${(b.y - b.r).toFixed(1)}px, 0)`
  }
}

function tick(now: number) {
  rafId = requestAnimationFrame(tick)
  if (!inView || !width) return
  const dt = Math.min((now - lastT) / 1000, 0.033)
  lastT = now
  physics(dt)
  render()
}

function startLoop() {
  if (running) return
  running = true
  lastT = performance.now()
  rafId = requestAnimationFrame(tick)
}

function stopLoop() {
  running = false
  cancelAnimationFrame(rafId)
}

function localPoint(e: PointerEvent) {
  const rect = wrapRef.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onPointerDown(e: PointerEvent) {
  const { x, y } = localPoint(e)
  let best = -1
  let bestDist = Infinity
  balls.forEach((b, i) => {
    const d = Math.hypot(b.x - x, b.y - y)
    if (d - b.r < 14 && d < bestDist) {
      bestDist = d
      best = i
    }
  })
  if (best === -1) return
  grabIndex = best
  const b = balls[best]!
  grabOffX = b.x - x
  grabOffY = b.y - y
  lastT = performance.now()
  b.vx = 0
  b.vy = 0
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (grabIndex === -1) return
  const { x, y } = localPoint(e)
  const b = balls[grabIndex]!
  const now = performance.now()
  const dt = Math.max(now - lastT, 1) / 1000
  b.vx = ((x + grabOffX - b.x) / dt) * 0.6
  b.vy = ((y + grabOffY - b.y) / dt) * 0.6
  b.x = x + grabOffX
  b.y = y + grabOffY
  lastT = now
  // keep the grabbed ball inside the pit
  b.x = Math.max(b.r, Math.min(width - b.r, b.x))
  b.y = Math.max(b.r, Math.min(height - b.r, b.y))
}

function onPointerUp() {
  if (grabIndex === -1) return
  const b = balls[grabIndex]!
  // clamp throw velocity
  b.vx = Math.max(-1600, Math.min(1600, b.vx))
  b.vy = Math.max(-1600, Math.min(1600, b.vy))
  grabIndex = -1
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  setup()
  const reduced = reducedQuery?.matches
  if (reduced) {
    // static: rest all balls along the bottom
    let x = 20
    for (const b of balls) {
      b.x = x + b.r
      b.y = height - b.r
      x += b.r * 2 + 8
      render()
    }
    return
  }
  startLoop()
  if (wrapRef.value) {
    observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false
      if (inView) startLoop()
      else stopLoop()
    })
    observer.observe(wrapRef.value)
  }
})

onUnmounted(() => {
  stopLoop()
  observer?.disconnect()
  observer = null
  for (const b of balls) b.el.remove()
  balls = []
})
</script>

<template>
  <div
    ref="wrapRef"
    class="skill-ballpit"
    aria-hidden="true"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  />
</template>

<style scoped>
.skill-ballpit {
  position: relative;
  width: 100%;
  height: 420px;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 0%, rgba(236, 72, 153, 0.05), transparent 50%),
    var(--page-bg);
  cursor: grab;
  touch-action: none;
  user-select: none;

  html.dark & {
    border-color: var(--border-light);
  }

  &:active {
    cursor: grabbing;
  }
}

:deep(.pit-ball) {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--ball-color) 55%, transparent);
  background: color-mix(in srgb, var(--ball-color) 12%, var(--card-bg));
  will-change: transform;
}

:deep(.pit-ball.has-label) {
  padding: 0 14px;
}

:deep(.pit-icon) {
  display: inline-flex;
}

:deep(.pit-label) {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}
</style>
