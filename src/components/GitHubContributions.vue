<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useThemeStore } from '@/stores/theme'

const WEEKS = 53
const DAYS = 7

const MONTH_LABELS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
]

const DAY_LABELS = ['', '周一', '', '周三', '', '周五', '']

const COLOR_SCALE = ['#E4E4E7', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777']
const COLOR_SCALE_DARK = ['#27272A', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777']

interface Cell {
  weekIndex: number
  dayIndex: number
  level: number
  count: number
  date: string
}

const cells = ref<Cell[]>([])
const totalContributions = ref(0)
const loading = ref(true)
const error = ref('')

function levelFromCount(count: number): number {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

async function fetchContributions() {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined
  if (!token) {
    error.value = '未配置 VITE_GITHUB_TOKEN'
    loading.value = false
    return
  }

  const query = `
    query {
      user(login: "JAYTDD") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error')

    const calendar = json.data.user.contributionsCollection.contributionCalendar
    totalContributions.value = calendar.totalContributions

    const result: Cell[] = []
    const weeks = calendar.weeks as Array<{
      contributionDays: Array<{ contributionCount: number; date: string; weekday: number }>
    }>

    // Take last WEEKS weeks
    const recentWeeks = weeks.slice(-WEEKS)

    recentWeeks.forEach((week, w) => {
      week.contributionDays.forEach((day) => {
        result.push({
          weekIndex: w,
          dayIndex: day.weekday,
          level: levelFromCount(day.contributionCount),
          count: day.contributionCount,
          date: day.date,
        })
      })
    })

    cells.value = result
  } catch (e: any) {
    error.value = e.message || '获取数据失败'
  } finally {
    loading.value = false
  }
}

const monthPositions = (() => {
  const positions: { index: number; label: string }[] = []
  const seen = new Set<string>()
  // Calculate from current date
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1))
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay())

  for (let w = 0; w < WEEKS; w++) {
    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + w * 7)
    const monthKey = `${weekStart.getFullYear()}-${weekStart.getMonth()}`
    if (!seen.has(monthKey)) {
      seen.add(monthKey)
      positions.push({
        index: w,
        label: MONTH_LABELS[weekStart.getMonth()]!,
      })
    }
  }
  return positions
})()

const svgWidth = WEEKS * 14 + 36
const svgHeight = DAYS * 14 + 24

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const themeStore = useThemeStore()

onMounted(() => {
  fetchContributions()

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    isVisible.value = true
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
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

      <!-- Loading -->
      <div v-if="loading" class="text-center text-sm text-text-tertiary dark:text-text-dark-tertiary py-8">
        加载中...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-sm text-red-400 py-8">
        {{ error }}
      </div>

      <!-- Heatmap SVG -->
      <div
        v-else
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
              :fill="themeStore.isDark ? '#71717A' : '#A1A1AA'"
            >
              {{ label }}
            </text>

            <!-- Month labels (x-axis) -->
            <text
              v-for="pos in monthPositions"
              :key="'month-' + pos.label + pos.index"
              :x="pos.index * 14 + 28"
              :y="10"
              class="text-[9px]"
              :fill="themeStore.isDark ? '#71717A' : '#A1A1AA'"
            >
              {{ pos.label }}
            </text>

            <!-- Contribution cells -->
            <rect
              v-for="(cell, idx) in cells"
              :key="'cell-' + idx"
              :x="cell.weekIndex * 14 + 28"
              :y="cell.dayIndex * 14 + 13"
              width="12"
              height="12"
              rx="2"
              :fill="themeStore.isDark ? COLOR_SCALE_DARK[cell.level] : COLOR_SCALE[cell.level]"
              :stroke="themeStore.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'"
              stroke-width="1"
              class="transition-all duration-300 ease-out"
              :class="{
                'opacity-0 scale-0': !isVisible,
                'opacity-100 scale-100': isVisible,
              }"
              :style="{
                transformOrigin: `${cell.weekIndex * 14 + 34}px ${cell.dayIndex * 14 + 19}px`,
              }"
            >
              <title>{{ cell.date }}: {{ cell.count }} 次贡献</title>
            </rect>
          </svg>
        </div>
      </div>

      <!-- Footer: total + legend -->
      <div
        v-if="!loading && !error"
        class="flex items-center justify-between mt-4 text-xs text-text-secondary dark:text-text-dark-secondary max-w-[780px] mx-auto transition-all duration-700 ease-out delay-300"
        :class="{
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        }"
        style="font-family: 'Geist Mono', monospace;"
      >
        <span>过去一年共 {{ totalContributions }} 次贡献</span>
        <div class="flex items-center gap-1.5">
          <span>Less</span>
          <svg width="60" height="12" class="inline-block">
            <rect v-for="i in 5" :key="'l-' + i" :x="(i - 1) * 12" y="0" width="10" height="10" rx="2" :fill="themeStore.isDark ? COLOR_SCALE_DARK[i - 1] : COLOR_SCALE[i - 1]" />
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
          href="https://github.com/JAYTDD"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-brand-pink dark:text-text-dark-tertiary dark:hover:text-brand-pink-light transition-colors hover:scale-105 transform duration-200"
        >
          <Icon icon="simple-icons:github" class="w-5 h-5" />
          在 GitHub 上查看
        </a>
      </div>
    </div>
  </section>
</template>
