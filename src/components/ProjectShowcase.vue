<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'

type Project = InstanceType<typeof ProjectCard>['$props']['project']

const props = defineProps<{ projects: Project[]; revealed: boolean }>()
const emit = defineEmits<{ 'mode-change': [stacked: boolean] }>()
const root = ref<HTMLElement | null>(null)
const stacked = ref(false)
const reducedMotion = ref(false)
const focusedIndex = ref<number | null>(null)
const items: HTMLElement[] = []
const scales: HTMLElement[] = []
let offsets: number[] = []
let topOffset = 96
let inView = false
let disposed = false
let updateFrame = 0
let layoutFrame = 0
let retryLayout = false
let measuring = false
let layoutAgain = false
let visibilityObserver: IntersectionObserver | undefined
let sizeObserver: ResizeObserver | undefined
let headerObserver: ResizeObserver | undefined
let media: MediaQueryList | undefined
let reduce: MediaQueryList | undefined

watch(stacked, value => emit('mode-change', value))

function setItem(index: number, element: unknown) {
  if (element instanceof HTMLElement) items[index] = element
}

function setScale(index: number, element: unknown) {
  if (element instanceof HTMLElement) scales[index] = element
}

function clearScales() {
  for (const element of scales) element.style.removeProperty('--stack-scale')
}

function update() {
  updateFrame = 0
  if (!stacked.value || !inView || document.hidden || !root.value) return
  const start = root.value.getBoundingClientRect().top + window.scrollY
  items.forEach((_, index) => {
    const offset = offsets[index] ?? 0
    const nextOffset = offsets[index + 1]
    const progress = nextOffset === undefined ? 0 : Math.max(0, Math.min(1,
      (window.scrollY - start - offset + topOffset + index * 12) / (nextOffset - offset),
    ))
    const scale = focusedIndex.value === index ? 1 : 1 - progress * 0.06
    scales[index]?.style.setProperty('--stack-scale', scale.toFixed(4))
  })
}

function scheduleUpdate() {
  if (!updateFrame && stacked.value && inView && !document.hidden) {
    updateFrame = requestAnimationFrame(update)
  }
}

async function measure() {
  layoutFrame = 0
  if (measuring) {
    layoutAgain = true
    return
  }
  const retry = retryLayout
  retryLayout = false
  if (disposed || !root.value || !media || !reduce) return
  reducedMotion.value = reduce.matches
  if (!media.matches || reduce.matches) {
    stacked.value = false
    clearScales()
    return
  }
  // A failed fit is retried on viewport/font changes, not its own grid resize.
  if (!retry && !stacked.value) return
  measuring = true
  try {
    stacked.value = true
    await nextTick()
    if (disposed || !root.value) return
    const header = document.querySelector<HTMLElement>('header')
    topOffset = (header?.getBoundingClientRect().height ?? 72) + 24
    root.value.style.setProperty('--stack-top', `${topOffset}px`)
    const maxHeight = Math.max(0, ...scales.map(element => element.offsetHeight))
    const lastTop = topOffset + Math.max(0, props.projects.length - 1) * 12
    if (maxHeight + lastTop + 24 > window.innerHeight) {
      stacked.value = false
      clearScales()
      return
    }
    // Temporarily measure normal-flow positions; sticky offsetTop changes as we scroll.
    items.forEach(element => { element.style.position = 'static' })
    const start = root.value.getBoundingClientRect().top
    offsets = items.map(element => element.getBoundingClientRect().top - start)
    items.forEach(element => { element.style.removeProperty('position') })
    root.value.style.setProperty('--stack-tail', `${Math.max(24, innerHeight - lastTop - maxHeight - 24)}px`)
    scheduleUpdate()
  } finally {
    measuring = false
    if (layoutAgain && !disposed) {
      layoutAgain = false
      scheduleLayout()
    }
  }
}

function scheduleLayout(retry = false) {
  retryLayout ||= retry
  if (!layoutFrame && !disposed) layoutFrame = requestAnimationFrame(() => { void measure() })
}

function onViewportChange() {
  scheduleLayout(true)
}

function onVisibilityChange() {
  if (document.hidden) {
    cancelAnimationFrame(updateFrame)
    updateFrame = 0
  } else {
    scheduleLayout(true)
  }
}

async function focusCard(index: number) {
  if (!stacked.value || !root.value) return
  focusedIndex.value = index
  await nextTick()
  if (disposed || !root.value || !stacked.value) return
  const top = root.value.getBoundingClientRect().top + window.scrollY + (offsets[index] ?? 0)
    - topOffset - index * 12
  window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
  scheduleUpdate()
}

function blurCard(event: FocusEvent, index: number) {
  if (event.relatedTarget instanceof Node && items[index]?.contains(event.relatedTarget)) return
  focusedIndex.value = null
  scheduleUpdate()
}

watch(() => props.projects, () => scheduleLayout(true))

onMounted(() => {
  media = matchMedia('(min-width: 1024px) and (min-height: 720px) and (hover: hover) and (pointer: fine)')
  reduce = matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', onViewportChange)
  reduce.addEventListener('change', onViewportChange)
  window.addEventListener('resize', onViewportChange, { passive: true })
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  visibilityObserver = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false
    if (inView) scheduleUpdate()
    else {
      cancelAnimationFrame(updateFrame)
      updateFrame = 0
    }
  }, { rootMargin: '100px' })
  if (root.value) visibilityObserver.observe(root.value)
  sizeObserver = new ResizeObserver(() => scheduleLayout())
  scales.forEach(element => sizeObserver?.observe(element))
  const header = document.querySelector('header')
  if (header) {
    headerObserver = new ResizeObserver(onViewportChange)
    headerObserver.observe(header)
  }
  void document.fonts.ready.then(() => { if (!disposed) scheduleLayout(true) })
  scheduleLayout(true)
})

onUnmounted(() => {
  disposed = true
  cancelAnimationFrame(updateFrame)
  cancelAnimationFrame(layoutFrame)
  visibilityObserver?.disconnect()
  sizeObserver?.disconnect()
  headerObserver?.disconnect()
  media?.removeEventListener('change', onViewportChange)
  reduce?.removeEventListener('change', onViewportChange)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', scheduleUpdate)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div ref="root" class="project-showcase" :class="{ 'is-stacked': stacked }" :data-stacked="stacked">
    <div
      v-for="(project, index) in projects"
      :key="project.name"
      :ref="element => setItem(index, element)"
      class="project-stack-item"
      :class="{ 'is-focused': focusedIndex === index }"
      :style="{ '--stack-index': index, '--reveal-delay': `${index * 60}ms` }"
      @focusin="focusCard(index)"
      @focusout="blurCard($event, index)"
    >
      <div
        :ref="element => setScale(index, element)"
        class="project-stack-scale"
        :class="{ 'is-revealed': revealed || reducedMotion }"
      >
        <ProjectCard :project="project" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-showcase {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
}
.project-stack-item { min-width: 0; }
.project-stack-scale {
  height: 100%;
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}
.project-stack-scale.is-revealed { opacity: 1; transform: none; }
@media (min-width: 640px) {
  .project-showcase { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
}
@media (min-width: 1024px) {
  .project-showcase { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.project-showcase.is-stacked {
  display: block;
  max-width: 880px;
  margin-inline: auto;
  padding-bottom: var(--stack-tail, 24px);
}
.is-stacked .project-stack-item {
  position: sticky;
  top: calc(var(--stack-top, 96px) + var(--stack-index) * 12px);
  z-index: calc(var(--stack-index) + 1);
  margin-bottom: 112px;
}
.is-stacked .project-stack-item:last-child { margin-bottom: 0; }
.is-stacked .project-stack-item.is-focused { z-index: 20; }
.is-stacked .project-stack-scale {
  height: auto;
  opacity: 1;
  transform: scale(var(--stack-scale, 1));
  transform-origin: top center;
  transition: none;
}
@media (prefers-reduced-motion: reduce) {
  .project-stack-scale { opacity: 1; transform: none; transition: none; }
}
</style>
