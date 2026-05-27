<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let petals: Petal[] = []
let reducedMotion = false

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
}

function createPetal(canvasWidth: number, canvasHeight: number): Petal {
  return {
    x: Math.random() * canvasWidth,
    y: -20 - Math.random() * canvasHeight,
    size: 8 + Math.random() * 12,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    fallSpeed: 0.3 + Math.random() * 0.7,
    swayOffset: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.02,
    swayAmount: 0.5 + Math.random() * 2,
    opacity: 0.4 + Math.random() * 0.4,
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  const { x, y, size, rotation, opacity } = petal

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)

  ctx.fillStyle = `rgba(255, 182, 193, ${opacity})`

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
    }

    drawPetal(ctx, petal)
  }

  animationId = requestAnimationFrame(animate)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function handleVisibilityChange() {
  if (document.hidden) {
    cancelAnimationFrame(animationId)
  } else if (!reducedMotion) {
    animate()
  }
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const canvas = canvasRef.value
  if (!canvas) return

  resize()
  petals = Array.from({ length: 35 }, () => createPetal(canvas.width, canvas.height))
  if (!reducedMotion) animate()

  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    aria-hidden="true"
    class="fixed left-0 top-0 pointer-events-none"
    style="z-index: 0"
  />
</template>
