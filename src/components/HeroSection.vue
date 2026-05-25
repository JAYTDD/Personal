<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const tags = ['全栈开发', 'React', 'TypeScript', 'Next.js', 'Agent']

const lines = [
  '欢迎来到我的博客',
  '你好，我是 Resin',
  '用代码，构建属于自己的宇宙。',
]
const displayedLines = ref(['', '', ''])
const currentLineIndex = ref(0)
const typingDone = ref(false)
const cursorVisible = ref(true)
const showTags = ref(false)
const dividerVisible = ref(false)

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
  cursorInterval = setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)

  setTimeout(() => typeLine(0), 500)
})

onUnmounted(() => {
  if (cursorInterval) clearInterval(cursorInterval)
})
</script>

<template>
  <section class="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
    <div class="text-center space-y-10">
      <!-- Line 1: Welcome text -->
      <p class="text-sm tracking-[0.2em] text-zinc-400 dark:text-zinc-500 h-5">
        {{ displayedLines[0] }}<span
          v-if="currentLineIndex === 0 && !typingDone"
          class="inline-block w-[3px] h-[0.9em] align-middle ml-0.5 bg-blue-400 dark:bg-blue-300 transition-opacity duration-100"
          :class="{ 'opacity-0': !cursorVisible }"
        />
      </p>

      <!-- Line 2: Main heading -->
      <div class="text-center">
        <h1 class="select-none text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-zinc-800 dark:text-zinc-100">
          {{ displayedLines[1] }}<span
            v-if="currentLineIndex === 1 && !typingDone"
            class="inline-block w-[3px] h-[0.9em] align-middle ml-0.5 bg-blue-400 dark:bg-blue-300 transition-opacity duration-100"
            :class="{ 'opacity-0': !cursorVisible }"
          />
        </h1>
        <!-- Line 3: Tagline -->
        <p class="select-none mt-3 text-base sm:text-lg text-zinc-400 dark:text-zinc-500 tracking-wide h-7">
          {{ displayedLines[2] }}<span
            v-if="currentLineIndex === 2 || typingDone"
            class="inline-block w-[3px] h-[0.9em] align-middle ml-1 bg-blue-400 dark:bg-blue-300 transition-opacity duration-100"
            :class="{ 'opacity-0': !cursorVisible }"
          />
        </p>
      </div>

      <!-- Divider -->
      <div
        class="mx-auto w-12 h-px bg-zinc-200 dark:bg-zinc-700 transition-all duration-500"
        :style="{ opacity: dividerVisible ? 1 : 0, transform: dividerVisible ? 'scaleX(1)' : 'scaleX(0)' }"
      />

      <!-- Tech tags -->
      <div class="flex flex-wrap justify-center gap-2">
        <span
          v-for="(tag, i) in tags"
          :key="tag"
          class="rounded-full px-4 py-1.5 text-xs font-medium bg-blue-50/60 text-blue-600 border border-blue-200/50 backdrop-blur-sm dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30 transition-all duration-500 ease-out select-none"
          :style="{
            opacity: showTags ? 1 : 0,
            transform: showTags ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.9)',
            transitionDelay: `${0.1 + i * 0.1}s`,
          }"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Bottom gradient -->
    <div class="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-pink-200/40 via-pink-100/20 to-transparent pointer-events-none dark:from-pink-900/20 dark:via-pink-900/5" />

    <!-- Scroll hint -->
    <div class="absolute bottom-8 flex flex-col items-center gap-3">
      <span class="text-xs tracking-widest text-zinc-300 dark:text-zinc-600">向下滚动</span>
      <Icon icon="lucide:chevrons-down" class="w-6 h-6 text-zinc-300 dark:text-zinc-600 animate-bounce" />
    </div>
  </section>
</template>

<style scoped>
</style>
