<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

const currentYear = new Date().getFullYear()
const copied = ref(false)

const navLinks = [
  { name: '首页', path: '/' },
  { name: '简历', path: '/resume' },
  { name: '关于', path: '/about' },
]

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = window.location.href
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <footer class="bg-white dark:bg-zinc-950">
    <div class="mx-auto max-w-4xl px-4 py-10">
      <!-- Top: Nav + Social -->
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:items-center">
        <!-- Left: Nav links -->
        <nav class="flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            {{ link.name }}
          </RouterLink>
        </nav>

        <!-- Right: Social icons + FAB -->
        <div class="flex items-center gap-4">
          <!-- WeChat -->
          <button
            type="button"
            class="text-gray-400 transition-colors duration-200 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
            title="微信"
          >
            <Icon icon="simple-icons:wechat" class="h-5 w-5" />
          </button>

          <!-- Bell -->
          <button
            type="button"
            class="text-gray-400 transition-colors duration-200 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
            title="通知"
          >
            <Icon icon="lucide:bell" class="h-5 w-5" />
          </button>

          <!-- GitHub -->
          <a
            href="https://github.com/resinya"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 transition-colors duration-200 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
            title="GitHub"
          >
            <Icon icon="simple-icons:github" class="h-5 w-5" />
          </a>

          <!-- TikTok -->
          <button
            type="button"
            class="text-gray-400 transition-colors duration-200 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
            title="抖音"
          >
            <Icon icon="simple-icons:tiktok" class="h-5 w-5" />
          </button>

          <!-- FAB Share Button -->
          <button
            type="button"
            class="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#E6FA72] to-[#F6FDC1] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-lime-500/60 dark:to-lime-300/60"
            title="分享链接"
            @click="copyUrl"
          >
            <Icon icon="lucide:arrow-up-right" class="h-5 w-5 text-gray-700 dark:text-gray-800" />
            <!-- Copied toast -->
            <span
              v-if="copied"
              class="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1 text-xs text-white dark:bg-gray-200 dark:text-gray-800"
            >
              已复制!
            </span>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="my-6 border-t border-gray-100 dark:border-gray-800" />

      <!-- Bottom: Copyright -->
      <p class="text-center text-sm text-gray-400 dark:text-gray-500">
        &copy; {{ currentYear }} Resin. All rights reserved.
      </p>
    </div>
  </footer>
</template>
