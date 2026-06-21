<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const tags = [
  { name: '全栈开发', color: 'pink' },
  { name: 'Vue', color: 'coral' },
  { name: 'Java', color: 'violet' },
  { name: 'TypeScript', color: 'pink' },
  { name: 'UniApp', color: 'coral' },
  { name: 'Pinia', color: 'pink' },
  { name: 'MySQL', color: 'coral' },
] as const

const lines = ['欢迎来到我的博客', '你好，我是 Lunesnow', '用代码，构建属于自己的宇宙。']
const displayedLines = ref(['', '', ''])
const currentLineIndex = ref(0)
const typingDone = ref(false)
const cursorVisible = ref(true)
const showTags = ref(false)
const dividerVisible = ref(false)
const isVisible = ref(false)

let cursorInterval: ReturnType<typeof setInterval> | null = null

function typeLine(lineIndex: number) {
  const text = lines[lineIndex]
  if (text === undefined) return

  let charIndex = 0
  const interval = setInterval(() => {
    if (charIndex < text.length) {
      displayedLines.value[lineIndex] += text.charAt(charIndex)
      charIndex++
    } else {
      clearInterval(interval)
      currentLineIndex.value++
      if (currentLineIndex.value < lines.length) {
        setTimeout(() => typeLine(currentLineIndex.value), 400)
      } else {
        typingDone.value = true
        setTimeout(() => {
          showTags.value = true
        }, 200)
        setTimeout(() => {
          dividerVisible.value = true
        }, 400)
      }
    }
  }, 100)
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    // Skip typewriter, show all text immediately
    displayedLines.value = [...lines]
    currentLineIndex.value = lines.length
    typingDone.value = true
    isVisible.value = true
    showTags.value = true
    dividerVisible.value = true
  } else {
    cursorInterval = setInterval(() => {
      cursorVisible.value = !cursorVisible.value
    }, 530)

    setTimeout(() => {
      isVisible.value = true
      setTimeout(() => typeLine(0), 300)
    }, 200)
  }
})

onUnmounted(() => {
  if (cursorInterval) clearInterval(cursorInterval)
})
</script>

<template>
  <section
    class="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 overflow-hidden"
  >
    <!-- Animated background gradient orbs -->

    <div class="text-center space-y-10 relative z-10">
      <!-- Line 1: Welcome text -->
      <p
        class="text-sm tracking-[0.2em] text-text-tertiary dark:text-text-dark-tertiary h-5 transition-all duration-700 ease-out"
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

      <!-- Line 2: Main heading -->
      <div
        class="text-center transition-all duration-700 ease-out delay-100"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
      >
        <h1
          class="select-none text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-text-primary dark:text-text-dark-primary"
        >
          {{ displayedLines[1]
          }}<span
            v-if="currentLineIndex === 1 && !typingDone"
            class="inline-block w-[3px] h-[0.9em] align-middle ml-0.5 bg-brand-pink dark:bg-brand-pink-light transition-opacity duration-100"
            :class="{ 'opacity-0': !cursorVisible }"
          />
        </h1>
        <!-- Line 3: Tagline -->
        <p
          class="select-none mt-3 text-base sm:text-lg text-text-secondary dark:text-text-dark-secondary tracking-wide h-7"
        >
          {{ displayedLines[2] }}
          <span
            v-if="currentLineIndex === 2 && !typingDone"
            class="inline-block w-[3px] h-[0.9em] align-middle ml-1 bg-brand-pink dark:bg-brand-pink-light transition-opacity duration-100"
            :class="{ 'opacity-0': !cursorVisible }"
          />
          <span
            v-else-if="typingDone && cursorVisible"
            class="inline-block w-[3px] h-[0.9em] align-middle ml-1 bg-brand-pink dark:bg-brand-pink-light transition-opacity duration-100"
          />
        </p>
      </div>

      <!-- Divider -->
      <div
        class="mx-auto w-12 h-px bg-border-default dark:bg-border-dark transition-all duration-700 ease-out"
        :class="{
          'opacity-0 scale-x-0': !dividerVisible,
          'opacity-100 scale-x-100': dividerVisible,
        }"
      />

      <!-- Tech tags with brand colors -->
      <div class="flex flex-wrap justify-center gap-2">
        <span
          v-for="(tag, i) in tags"
          :key="tag.name"
          class="rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-500 ease-out select-none hover:scale-105 hover:shadow-md cursor-default"
          :class="{
            'tag-pink': tag.color === 'pink',
            'tag-coral': tag.color === 'coral',
            'tag-violet': tag.color === 'violet',
            'opacity-0 translate-y-4 scale-90': !showTags,
            'opacity-100 translate-y-0 scale-100': showTags,
          }"
          :style="{
            transitionDelay: `${0.1 + i * 0.1}s`,
          }"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>

    <!-- Scroll hint with enhanced animation -->
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
