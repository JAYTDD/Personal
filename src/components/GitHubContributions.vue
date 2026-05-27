<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const WEEKS = 52
const DAYS = 7

const MONTH_LABELS = [
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  'Jan', 'Feb', 'Mar', 'Apr', 'May',
]

const DAY_LABELS = ['', '周一', '', '周三', '', '周五', '']

// Updated color scale with brand teal
const COLOR_SCALE = ['#E4E4E7', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777']

interface Cell {
  weekIndex: number
  dayIndex: number
  level: number
}

const cells = computed<Cell[]>(() => {
  const result: Cell[] = []
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS; d++) {
      result.push({
        weekIndex: w,
        dayIndex: d,
        level: Math.floor(Math.random() * 5),
      })
    }
  }
  return result
})

const totalContributions = computed(() => {
  return cells.value.reduce((sum, c) => sum + c.level, 0)
})

const monthPositions = computed(() => {
  const positions: { index: number; label: string }[] = []
  const weeksPerMonth = WEEKS / MONTH_LABELS.length
  for (let i = 0; i < MONTH_LABELS.length; i++) {
    positions.push({
      index: Math.floor(i * weeksPerMonth),
      label: MONTH_LABELS[i]!,
    })
  }
  return positions
})

const svgWidth = WEEKS * 14 + 36
const svgHeight = DAYS * 14 + 24

// Scroll reveal
const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})
</script>

<template>
  <section ref="sectionRef" class="pb-16 pt-8">
    <div class="mx-auto max-w-4xl px-4">
      <h2
        class="text-xl font-semibold tracking-wide text-text-primary dark:text-text-dark-primary text-center mb-6 transition-all duration-700 ease-out"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
      >
        我的 GitHub 贡献
      </h2>

      <!-- Heatmap SVG -->
      <div
        class="overflow-x-auto pb-2 transition-all duration-700 ease-out delay-100"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
      >
        <div class="flex justify-center min-w-[780px]">
          <svg :width="svgWidth" :height="svgHeight" class="shrink-0" style="font-family: 'Geist Mono', monospace;">
            <!-- Day labels (y-axis) -->
            <text
              v-for="(label, i) in DAY_LABELS"
              :key="'day-label-' + i"
              :x="0"
              :y="i * 14 + 22"
              class="text-[9px]"
              fill="#A1A1AA"
            >
              {{ label }}
            </text>

            <!-- Month labels (x-axis) -->
            <text
              v-for="pos in monthPositions"
              :key="'month-' + pos.label"
              :x="pos.index * 14 + 28"
              :y="10"
              class="text-[9px]"
              fill="#A1A1AA"
            >
              {{ pos.label }}
            </text>

            <!-- Contribution cells with staggered animation -->
            <rect
              v-for="(cell, idx) in cells"
              :key="'cell-' + idx"
              :x="cell.weekIndex * 14 + 28"
              :y="cell.dayIndex * 14 + 13"
              width="12"
              height="12"
              rx="2"
              :fill="COLOR_SCALE[cell.level] || COLOR_SCALE[0]"
              stroke="rgba(0,0,0,0.06)"
              stroke-width="1"
              class="transition-all duration-300 ease-out"
              :class="{
                'opacity-0 scale-0': !isVisible,
                'opacity-100 scale-100': isVisible,
              }"
              :style="{
                transitionDelay: `${Math.min(idx * 2, 800)}ms`,
                transformOrigin: `${cell.weekIndex * 14 + 34}px ${cell.dayIndex * 14 + 19}px`,
              }"
            />
          </svg>
        </div>
      </div>

      <!-- Footer: total + legend -->
      <div
        class="flex items-center justify-between mt-4 text-xs text-text-secondary dark:text-text-dark-secondary max-w-[780px] mx-auto transition-all duration-700 ease-out delay-300"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
        style="font-family: 'Geist Mono', monospace;"
      >
        <span>总共有 {{ totalContributions }} 贡献</span>
        <div class="flex items-center gap-1.5">
          <span>Less</span>
          <svg width="60" height="12" class="inline-block">
            <rect v-for="i in 5" :key="'l-' + i" :x="(i - 1) * 12" y="0" width="10" height="10" rx="2" :fill="COLOR_SCALE[i - 1] || COLOR_SCALE[0]" />
          </svg>
          <span>More</span>
        </div>
      </div>

      <!-- GitHub link -->
      <div
        class="text-center mt-4 transition-all duration-700 ease-out delay-400"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
      >
        <a
          href="https://github.com/resinya"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-brand-pink dark:text-text-dark-tertiary dark:hover:text-brand-pink-light transition-colors hover:scale-105 transform duration-200"
        >
          <Icon icon="simple-icons:github" class="w-5 h-5" />
          click 一下
        </a>
      </div>
    </div>
  </section>
</template>
