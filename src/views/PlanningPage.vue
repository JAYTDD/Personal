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
      <h1 class="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-2">规划</h1>
      <p class="text-text-secondary dark:text-text-dark-secondary mb-8">规划出充实的人生</p>

      <!-- Search -->
      <div class="relative mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索"
          class="w-full max-w-xs rounded-full border border-border-default bg-bg-primary px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-pink/30 dark:border-border-dark dark:bg-bg-dark-primary dark:text-text-dark-primary dark:placeholder:text-text-dark-tertiary"
        >
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="f in filters"
          :key="f"
          @click="activeFilter = f"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
          :class="activeFilter === f
            ? 'bg-bg-inverse text-text-inverse dark:bg-bg-primary dark:text-text-primary'
            : 'bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary dark:bg-bg-dark-secondary dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-tertiary'"
        >
          {{ f }}
        </button>
      </div>

      <!-- Plans List -->
      <div class="space-y-4">
        <div
          v-for="plan in filteredPlans"
          :key="plan.title"
          class="rounded-xl border border-border-default bg-bg-primary p-5 dark:border-border-dark dark:bg-bg-dark-primary transition-all duration-300 hover:border-border-hover dark:hover:border-border-dark-hover hover:shadow-sm"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <span class="text-xs font-mono text-text-tertiary dark:text-text-dark-tertiary">{{ plan.category }}</span>
              <h3 class="text-lg font-mono font-bold text-text-primary dark:text-text-dark-primary">{{ plan.title }}</h3>
            </div>
            <span class="rounded-full px-3 py-0.5 text-xs font-medium tag-violet">{{ plan.status }}</span>
          </div>
          <p class="text-xs font-mono text-text-tertiary dark:text-text-dark-tertiary mb-2">{{ plan.dateRange }}</p>
          <hr class="border-border-default dark:border-border-dark mb-2">
          <p class="text-sm text-text-secondary dark:text-text-dark-secondary">{{ plan.description }}</p>
        </div>
      </div>

      <p v-if="filteredPlans.length === 0" class="text-center text-text-tertiary dark:text-text-dark-tertiary py-12">
        没有找到相关规划
      </p>
    </div>
  </div>
</template>
