<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

const visible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    visible.value = true
  })
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] px-4">
    <div
      class="text-center transition-all duration-700 ease-out"
      :class="{
        'opacity-0 translate-y-8': !visible,
        'opacity-100 translate-y-0': visible,
      }"
    >
      <!-- 404 number with gradient -->
      <div class="relative mb-6">
        <span class="text-[120px] sm:text-[160px] font-bold leading-none tracking-tighter bg-gradient-to-br from-brand-pink via-brand-violet to-brand-coral bg-clip-text text-transparent opacity-20 dark:opacity-10 select-none">
          404
        </span>
        <Icon
          icon="lucide:compass"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 text-brand-pink dark:text-brand-pink-light animate-spin"
          style="animation-duration: 8s"
        />
      </div>

      <h1 class="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-3">
        页面走丢了
      </h1>
      <p class="text-sm sm:text-base text-text-secondary dark:text-text-dark-secondary mb-8 max-w-md mx-auto">
        你要找的页面可能已被移除、改名，或者从未存在过。
      </p>

      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gradient-pink text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Icon icon="lucide:house" class="w-4 h-4" />
        返回首页
      </RouterLink>
    </div>
  </div>
</template>
