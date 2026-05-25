<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeFilter = ref('全部')

const filters = ['全部', '学习', '实习', '技术', '日常']

interface Plan {
  title: string
  category: string
  status: string
  dateRange: string
  description: string
}

const plans: Plan[] = [
  {
    title: 'leetcode',
    category: '技术',
    status: '进行中',
    dateRange: '2026-05-21 ~ 2026-06-10',
    description: '这个一定要完成，完成leetcode100',
  },
  {
    title: '单片机考试',
    category: '学习',
    status: '进行中',
    dateRange: '2026-05-21 ~ 2026-06-01',
    description: '看完b站对应课程，这可不能挂科。。。',
  },
  {
    title: '面试鸭/openclaw',
    category: '技术',
    status: '进行中',
    dateRange: '2026-05-21 ~ 2026-05-23',
    description: '充分学习这个',
  },
]

const filteredPlans = computed(() => {
  let result = plans
  if (activeFilter.value !== '全部') {
    result = result.filter(p => p.category === activeFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  return result
})
</script>

<template>
  <div class="relative z-10">
    <div class="mx-auto max-w-4xl px-4 py-16">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">规划</h1>
      <p class="text-zinc-500 dark:text-zinc-400 mb-8">规划出充实的人生</p>

      <!-- Search -->
      <div class="relative mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索"
          class="w-full max-w-xs rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        >
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="f in filters"
          :key="f"
          @click="activeFilter = f"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="activeFilter === f
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'"
        >
          {{ f }}
        </button>
      </div>

      <!-- Plans List -->
      <div class="space-y-4">
        <div
          v-for="plan in filteredPlans"
          :key="plan.title"
          class="border-3 border-zinc-900 bg-white p-5 dark:border-zinc-200 dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] transition-shadow duration-200"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">{{ plan.category }}</span>
              <h3 class="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">{{ plan.title }}</h3>
            </div>
            <span class="rounded-full px-3 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30">{{ plan.status }}</span>
          </div>
          <p class="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-2">{{ plan.dateRange }}</p>
          <hr class="border-zinc-200 dark:border-zinc-700 mb-2">
          <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ plan.description }}</p>
        </div>
      </div>

      <p v-if="filteredPlans.length === 0" class="text-center text-zinc-400 dark:text-zinc-500 py-12">
        没有找到相关规划
      </p>
    </div>
  </div>
</template>
