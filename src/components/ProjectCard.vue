<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

interface Project {
  name: string
  title: string
  description: string
  gradient: { from: string; to: string }
  language: string | null
  topics: string[]
  stars: number
  github: string
}

defineProps<{
  project: Project
  index: number
}>()

const cardRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHovered = ref(false)
const reducedMotion = ref(false)

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const spotlightStyle = computed(() => {
  if (!isHovered.value || reducedMotion.value) return { opacity: 0 }
  return {
    opacity: 1,
    background: `radial-gradient(600px circle at ${mouseX.value}px ${mouseY.value}px, rgba(255,255,255,0.06), transparent 40%)`,
  }
})

const cardTransform = computed(() => {
  if (!isHovered.value || reducedMotion.value) return 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect) return ''
  const x = mouseX.value - rect.width / 2
  const y = mouseY.value - rect.height / 2
  const rotateX = (y / rect.height) * -10
  const rotateY = (x / rect.width) * 10
  return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
})

const glowStyle = computed(() => {
  if (!isHovered.value || reducedMotion.value) return { opacity: 0 }
  return {
    opacity: 1,
    background: `radial-gradient(400px circle at ${mouseX.value}px ${mouseY.value}px, rgba(236, 72, 153, 0.15), transparent 50%)`,
  }
})

function handleMouseMove(e: MouseEvent) {
  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect) return
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}
</script>

<template>
  <article
    ref="cardRef"
    class="group relative aspect-[6/4] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 ease-out"
    :style="{
      transform: cardTransform,
      willChange: reducedMotion ? 'auto' : 'transform',
    }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Glow border overlay -->
    <div
      class="absolute inset-0 pointer-events-none z-30 rounded-xl transition-opacity duration-300"
      :style="glowStyle"
    />

    <!-- Spotlight overlay -->
    <div
      class="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
      :style="spotlightStyle"
    />

    <!-- Gradient Background -->
    <div
      class="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
      :style="{
        background: `linear-gradient(135deg, ${project.gradient.from}, ${project.gradient.to})`,
      }"
    />

    <!-- Star Badge -->
    <div
      v-if="project.stars > 0"
      class="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-black/20 text-white/90 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
    >
      <Icon icon="lucide:star" width="12" height="12" />
      <span>{{ project.stars }}</span>
    </div>

    <!-- Language Indicator Dot -->
    <div
      v-if="project.language"
      class="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-black/20 text-white/90 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
    >
      <span
        class="w-2 h-2 rounded-full"
        :style="{ background: project.gradient.from }"
      />
      <span>{{ project.language }}</span>
    </div>

    <!-- Hover overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[500ms] ease-out z-10"
    >
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <h3 class="text-xl font-bold text-white mb-1">{{ project.title }}</h3>
        <p class="text-sm text-white/70 line-clamp-2 mb-3">
          {{ project.description }}
        </p>

        <!-- Topics -->
        <div class="flex flex-wrap gap-1.5 mb-3">
          <span
            v-for="topic in project.topics"
            :key="topic"
            class="rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/15 text-white border border-white/20 transition-transform duration-200 hover:scale-105"
          >
            {{ topic }}
          </span>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-2">
          <a
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
            :aria-label="'查看 ' + project.title + ' 的 GitHub 仓库'"
            @click.stop
          >
            <Icon icon="simple-icons:github" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
