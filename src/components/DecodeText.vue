<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{ text: string }>()
const rootRef = ref<HTMLElement | null>(null)
const decoding = ref(false)
const visibleText = ref(props.text)
const SYMBOLS = Array.from('＃＄％＆＊＋＝？')
const DURATION = 550

let state: 'idle' | 'waiting' | 'playing' | 'done' = 'idle'
let observer: IntersectionObserver | null = null
let reducedQuery: MediaQueryList | null = null
let rafId = 0
let timer: ReturnType<typeof setTimeout> | null = null
let disposed = false

function finish() {
  state = 'done'
  cancelAnimationFrame(rafId)
  rafId = 0
  if (timer !== null) clearTimeout(timer)
  timer = null
  decoding.value = false
  visibleText.value = props.text
  observer?.disconnect()
}

function play() {
  state = 'playing'
  decoding.value = true
  const characters = Array.from(props.text)
  const startedAt = performance.now()

  const step = () => {
    if (disposed || state !== 'playing') return
    const progress = Math.min((performance.now() - startedAt) / DURATION, 1)
    if (progress === 1) {
      finish()
      return
    }
    const locked = Math.floor(characters.length * progress)
    visibleText.value = characters
      .map((character, index) => {
        if (index < locked || /[\p{P}\s]/u.test(character)) return character
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!
      })
      .join('')
    timer = setTimeout(step, 50)
  }

  step()
}

function waitForEntrance() {
  rafId = 0
  if (disposed || state !== 'waiting') return

  // 等待路由与 section 入场；忽略常驻的无限循环装饰。
  let ancestor: HTMLElement | null = rootRef.value
  while (ancestor) {
    // A child's observer can fire before its parent's reveal threshold.
    const style = getComputedStyle(ancestor)
    if (Number(style.opacity) === 0 || style.visibility === 'hidden') {
      rafId = requestAnimationFrame(waitForEntrance)
      return
    }
    const entering = ancestor.getAnimations().some((animation) => {
      const endTime = animation.effect?.getComputedTiming().endTime
      return (
        (animation.playState === 'running' || animation.pending) && Number.isFinite(endTime)
      )
    })
    if (entering) {
      rafId = requestAnimationFrame(waitForEntrance)
      return
    }
    ancestor = ancestor.parentElement
  }
  play()
}

function onVisibilityChange() {
  if (document.hidden) finish()
}

function onReducedMotionChange(event: MediaQueryListEvent) {
  if (event.matches) finish()
}

watch(() => props.text, finish)

onMounted(() => {
  reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedQuery.addEventListener('change', onReducedMotionChange)
  document.addEventListener('visibilitychange', onVisibilityChange)

  if (reducedQuery.matches || document.hidden || !props.text) {
    finish()
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && state === 'idle') {
        state = 'waiting'
        rafId = requestAnimationFrame(waitForEntrance)
      } else if (!entry?.isIntersecting && (state === 'waiting' || state === 'playing')) {
        finish()
      }
    },
    { threshold: 0.35 },
  )
  if (rootRef.value) observer.observe(rootRef.value)
})

onUnmounted(() => {
  disposed = true
  finish()
  observer = null
  reducedQuery?.removeEventListener('change', onReducedMotionChange)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <span ref="rootRef" class="decode-text">
    <span :class="{ 'decode-text-source-active': decoding }">{{ text }}</span>
    <span v-if="decoding" class="decode-text-overlay" aria-hidden="true">{{ visibleText }}</span>
  </span>
</template>

<style scoped>
.decode-text {
  position: relative;
  display: inline-block;
}

.decode-text-source-active {
  color: transparent;
}

.decode-text-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}
</style>
