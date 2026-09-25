<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import { SITE_NAME } from '@/data/site'
import { useTypewriter } from '@/composables/useTypewriter'
import { useWordRotate } from '@/composables/useWordRotate'
import ParticleText from '@/components/ParticleText.vue'

const tags = [
  { name: '前端开发', color: 'pink' },
  { name: 'Vue', color: 'emerald' },
  { name: 'TypeScript', color: 'blue' },
  { name: 'Java', color: 'coral' },
  { name: 'UniApp', color: 'cyan' },
  { name: 'Pinia', color: 'amber' },
  { name: 'MySQL', color: 'violet' },
] as const

// The typewriter only types the welcome line; the brand heading is the
// particle-text canvas and the tagline rotates in after typing finishes.
const textLines = ['欢迎来到我的博客']
const particleWords = ['Lunesnow', 'VUE', 'TYPESCRIPT']

// Tagline rotates after the typewriter finishes typing line 3.
// First entry must equal textLines[2] so the swap is invisible.
const taglines = ['用代码，构建属于自己的宇宙。', '把每一个想法，都变成看得见的作品。', '在像素与逻辑之间，寻找平衡。'] as const

const isVisible = ref(false)
const showTags = ref(false)
const dividerVisible = ref(false)
const cursorVisible = ref(true)

let cursorInterval: ReturnType<typeof setInterval> | null = null
let startTimeout: ReturnType<typeof setTimeout> | null = null
let tagsTimeout: ReturnType<typeof setTimeout> | null = null
let dividerTimeout: ReturnType<typeof setTimeout> | null = null

const {
  lines: displayedLines,
  activeLineIndex: currentLineIndex,
  done: typingDone,
  start,
} = useTypewriter(textLines, {
  speed: 100,
  lineDelay: 400,
  startDelay: 500,
  onAllDone: () => {
    tagsTimeout = setTimeout(() => {
      showTags.value = true
    }, 200)
    dividerTimeout = setTimeout(() => {
      dividerVisible.value = true
    }, 400)
  },
})

// Tagline rotation starts only once typing is done (skipped for reduced motion,
// where the typewriter fills instantly and the tagline stays static)
const { index: taglineIndex, start: startTaglineRotate } = useWordRotate(taglines, {
  interval: 4500,
})
watch(typingDone, (done) => {
  if (done && !prefersReducedMotion()) startTaglineRotate()
})

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  const reducedMotion = prefersReducedMotion()

  if (reducedMotion) {
    // Skip typewriter, show all text immediately
    isVisible.value = true
    showTags.value = true
    dividerVisible.value = true
  } else {
    cursorInterval = setInterval(() => {
      cursorVisible.value = !cursorVisible.value
    }, 530)
    startTimeout = setTimeout(() => {
      isVisible.value = true
    }, 200)
  }

  // Reduced motion: fills every line instantly; typed mode: waits startDelay
  start()
})

onUnmounted(() => {
  if (cursorInterval) clearInterval(cursorInterval)
  if (startTimeout) clearTimeout(startTimeout)
  if (tagsTimeout) clearTimeout(tagsTimeout)
  if (dividerTimeout) clearTimeout(dividerTimeout)
})
</script>

<template>
  <section
    class="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 overflow-hidden"
  >
    <div class="text-center space-y-8 sm:space-y-10 relative z-10 max-w-5xl mx-auto">
      <!-- Line 1: Welcome text -->
      <p
        class="text-sm sm:text-base tracking-[0.28em] uppercase text-text-tertiary dark:text-text-dark-tertiary min-h-[1.5rem] transition-all duration-700 ease-out"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
      >
        {{ displayedLines[0]
        }}<span
          v-if="currentLineIndex === 0 && !typingDone"
          class="inline-block w-[3px] h-[0.9em] align-middle ml-0.5 bg-brand-pink dark:bg-brand-pink-light transition-opacity duration-100"
          :class="{ 'opacity-0': !cursorVisible }"
        />
      </p>

      <!-- Line 2: Particle-text brand (real heading kept for a11y/SEO) -->
      <div
        class="transition-all duration-700 ease-out delay-100"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
      >
        <h1 class="sr-only">{{ SITE_NAME }}</h1>
        <ParticleText :words="particleWords" />
      </div>

      <!-- Line 3: Tagline (rotates in after typing finishes) -->
      <p
        class="select-none mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl text-text-secondary dark:text-text-dark-secondary tracking-wide min-h-[2rem] font-light"
      >
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <span v-if="typingDone" :key="taglineIndex" class="inline-block">{{ taglines[taglineIndex] }}</span>
        </Transition>
        <span
          v-if="typingDone && cursorVisible"
          class="inline-block w-[3px] h-[0.9em] align-middle ml-1 bg-brand-pink dark:bg-brand-pink-light transition-opacity duration-100"
        />
      </p>

      <!-- Divider -->
      <div
        class="mx-auto w-14 h-px bg-border-default dark:bg-border-dark transition-all duration-700 ease-out"
        :class="{
          'opacity-0 scale-x-0': !dividerVisible,
          'opacity-100 scale-x-100': dividerVisible,
        }"
      />

      <!-- Tech tags — each color unique -->
      <div class="flex flex-wrap justify-center gap-2.5">
        <span
          v-for="(tag, i) in tags"
          :key="tag.name"
          class="rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-500 ease-out select-none hover:scale-105 hover:shadow-md cursor-default"
          :class="[
            `tag-${tag.color}`,
            {
              'opacity-0 translate-y-4 scale-90': !showTags,
              'opacity-100 translate-y-0 scale-100': showTags,
            },
          ]"
          :style="{
            transitionDelay: `${0.1 + i * 0.08}s`,
          }"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="absolute bottom-8 flex flex-col items-center gap-2">
      <AppIcon
        name="lucide:chevrons-down"
        class="w-5 h-5 text-text-tertiary dark:text-text-dark-tertiary transition-all duration-500"
        :class="{
          'opacity-0 translate-y-2': !typingDone,
          'opacity-60 translate-y-0 animate-bounce': typingDone,
        }"
      />
    </div>
  </section>
</template>
