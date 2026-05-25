<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const tags = ['全栈开发', 'Vue', 'Java', 'TypeScript', 'UniApp']

const lines = [
  '欢迎来到我的博客',
  '你好，我是 Lunesnow',
  '用代码，构建属于自己的宇宙。',
]
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
  cursorInterval = setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)

  setTimeout(() => {
    isVisible.value = true
    setTimeout(() => typeLine(0), 300)
  }, 200)
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
    <div
      class="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-3xl animate-pulse"
        style="animation-duration: 8s"
      />
      <div
        class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink-400/10 dark:bg-pink-500/10 blur-3xl animate-pulse"
        style="animation-duration: 10s; animation-delay: 2s"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-400/5 dark:bg-purple-500/5 blur-3xl animate-pulse"
        style="animation-duration: 12s; animation-delay: 4s"
      />
    </div>

    <div class="text-center space-y-10 relative z-10">
      <!-- Line 1: Welcome text -->
      <p
        class="text-sm tracking-[0.2em] text-zinc-400 dark:text-zinc-500 h-5 transition-all duration-700 ease-out"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
      >
        {{ displayedLines[0]
        }}<span
          v-if="currentLineIndex === 0 && !typingDone"
          class="inline-block w-[3px] h-[0.9em] align-middle ml-0.5 bg-blue-400 dark:bg-blue-300 transition-opacity duration-100"
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
          class="select-none text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-zinc-800 dark:text-zinc-100"
        >
          {{ displayedLines[1]
          }}<span
            v-if="currentLineIndex === 1 && !typingDone"
            class="inline-block w-[3px] h-[0.9em] align-middle ml-0.5 bg-blue-400 dark:bg-blue-300 transition-opacity duration-100"
            :class="{ 'opacity-0': !cursorVisible }"
          />
        </h1>
        <!-- Line 3: Tagline -->
        <p
          class="select-none mt-3 text-base sm:text-lg text-zinc-400 dark:text-zinc-500 tracking-wide h-7"
        >
          {{ displayedLines[2]
          }}<span
            v-if="currentLineIndex === 2 || typingDone"
            class="inline-block w-[3px] h-[0.9em] align-middle ml-1 bg-blue-400 dark:bg-blue-300 transition-opacity duration-100"
            :class="{ 'opacity-0': !cursorVisible }"
          />
        </p>
      </div>

      <!-- Divider -->
      <div
        class="mx-auto w-12 h-px bg-zinc-200 dark:bg-zinc-700 transition-all duration-700 ease-out"
        :class="{
          'opacity-0 scale-x-0': !dividerVisible,
          'opacity-100 scale-x-100': dividerVisible,
        }"
      />

      <!-- Tech tags -->
      <div class="flex flex-wrap justify-center gap-2">
        <span
          v-for="(tag, i) in tags"
          :key="tag"
          class="rounded-full px-4 py-1.5 text-xs font-medium bg-blue-50/60 text-blue-600 border border-blue-200/50 backdrop-blur-sm dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30 transition-all duration-500 ease-out select-none hover:scale-105 hover:shadow-md cursor-default"
          :class="{
            'opacity-0 translate-y-4 scale-90': !showTags,
            'opacity-100 translate-y-0 scale-100': showTags,
          }"
          :style="{
            transitionDelay: `${0.1 + i * 0.1}s`,
          }"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Bottom gradient -->
    <div
      class="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-pink-200/40 via-pink-100/20 to-transparent pointer-events-none dark:from-pink-900/20 dark:via-pink-900/5"
    />

    <!-- Scroll hint with enhanced animation -->
    <div class="absolute bottom-8 flex flex-col items-center gap-3">
      <span
        class="text-xs tracking-widest text-zinc-300 dark:text-zinc-600 transition-all duration-500"
        :class="{
          'opacity-0 translate-y-2': !typingDone,
          'opacity-100 translate-y-0': typingDone,
        }"
      >
        向下滚动
      </span>
      <Icon
        icon="lucide:chevrons-down"
        class="w-6 h-6 text-zinc-300 dark:text-zinc-600 transition-all duration-500"
        :class="{
          'opacity-0 translate-y-2': !typingDone,
          'opacity-100 translate-y-0 animate-bounce': typingDone,
        }"
      />
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
