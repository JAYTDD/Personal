<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let petals: Petal[] = []
let reducedMotion = false
let isDarkMode = false
let themeObserver: MutationObserver | null = null

interface Petal {
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  fallSpeed: number
  swayOffset: number
  swaySpeed: number
  swayAmount: number
  opacity: number
  hue: number
}

function createPetal(canvasWidth: number, canvasHeight: number): Petal {
  const sizeBase = 10 + Math.random() * 18
  return {
    x: Math.random() * canvasWidth,
    y: -20 - Math.random() * canvasHeight,
    size: sizeBase,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.015,
    fallSpeed: 0.08 + Math.random() * 0.28,
    swayOffset: Math.random() * Math.PI * 2,
    swaySpeed: 0.004 + Math.random() * 0.01,
    swayAmount: 0.4 + Math.random() * 1.4,
    opacity: isDarkMode ? 0.2 + Math.random() * 0.3 : 0.38 + Math.random() * 0.42,
    hue: Math.random() * 20 - 10,
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  const { x, y, size, rotation, opacity, hue } = petal

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)

  const r = Math.min(255, 255)
  const g = Math.min(255, Math.max(0, 182 + hue))
  const b = Math.min(255, Math.max(0, 193 + hue * 0.5))
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(size * 0.5, -size * 0.3, size * 0.8, -size * 0.1, size, size * 0.3)
  ctx.bezierCurveTo(size * 0.6, size * 0.1, size * 0.3, -size * 0.05, 0, 0)
  ctx.fill()

  ctx.restore()
}

function animate() {
  if (reducedMotion) return

  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const petal of petals) {
    petal.y += petal.fallSpeed
    petal.x += Math.sin(petal.swayOffset) * petal.swayAmount
    petal.swayOffset += petal.swaySpeed
    petal.rotation += petal.rotationSpeed

    if (petal.y > canvas.height + 20) {
      const newPetal = createPetal(canvas.width, canvas.height)
      petal.x = newPetal.x
      petal.y = newPetal.y
      petal.size = newPetal.size
      petal.fallSpeed = newPetal.fallSpeed
      petal.opacity = newPetal.opacity
      petal.hue = newPetal.hue
    }

    drawPetal(ctx, petal)
  }

  animationId = requestAnimationFrame(animate)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

function checkDarkMode() {
  isDarkMode = document.documentElement.classList.contains('dark')
}

function handleVisibilityChange() {
  if (document.hidden) {
    cancelAnimationFrame(animationId)
  } else if (!reducedMotion) {
    animate()
  }
}

function handleThemeChange() {
  checkDarkMode()
  petals.forEach((p) => {
    p.opacity = isDarkMode ? 0.15 + Math.random() * 0.25 : 0.3 + Math.random() * 0.4
  })
}

function startAnimation() {
  if (reducedMotion) return
  const canvas = canvasRef.value
  if (!canvas) return

  checkDarkMode()
  resize()

  const base = window.innerWidth < 768 ? 18 : window.innerWidth < 1200 ? 24 : 32
  const count = Math.round(base * 1.3)
  petals = Array.from({ length: count }, () =>
    createPetal(window.innerWidth, window.innerHeight),
  )

  animate()

  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  themeObserver = new MutationObserver(() => {
    handleThemeChange()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Defer canvas init to browser idle time so it never competes with the
  // first paint of <RouterView> and the appear animation.
  const start = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startAnimation()
      })
    })
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(start, { timeout: 800 })
  } else {
    setTimeout(start, 0)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  themeObserver?.disconnect()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    aria-hidden="true"
    class="fixed left-0 top-0 pointer-events-none z-[100]"
  />
</template>
