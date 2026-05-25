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

const socialLinks = [
  { icon: 'simple-icons:wechat', title: '微信', href: '#' },
  { icon: 'lucide:bell', title: '通知', href: '#' },
  { icon: 'simple-icons:github', title: 'GitHub', href: 'https://github.com/resinya', external: true },
  { icon: 'simple-icons:tiktok', title: '抖音', href: '#' },
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
            class="relative text-sm text-gray-500 transition-all duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 group"
          >
            {{ link.name }}
            <span class="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 dark:bg-gray-100 transition-all duration-200 group-hover:w-full" />
          </RouterLink>
        </nav>

        <!-- Right: Social icons + FAB -->
        <div class="flex items-center gap-4">
          <template v-for="link in socialLinks" :key="link.icon">
            <a
              v-if="link.external"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 transition-all duration-200 hover:text-gray-700 hover:scale-110 dark:text-gray-500 dark:hover:text-gray-200"
              :title="link.title"
            >
              <Icon :icon="link.icon" class="h-5 w-5" />
            </a>
            <button
              v-else
              type="button"
              class="text-gray-400 transition-all duration-200 hover:text-gray-700 hover:scale-110 dark:text-gray-500 dark:hover:text-gray-200"
              :title="link.title"
            >
              <Icon :icon="link.icon" class="h-5 w-5" />
            </button>
          </template>

          <!-- FAB Share Button -->
          <button
            type="button"
            class="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#E6FA72] to-[#F6FDC1] shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-3 active:scale-95 dark:from-lime-500/60 dark:to-lime-300/60"
            title="分享链接"
            @click="copyUrl"
          >
            <Icon icon="lucide:arrow-up-right" class="h-5 w-5 text-gray-700 dark:text-gray-800 transition-transform duration-200" :class="{ 'rotate-45': copied }" />
            <!-- Copied toast -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-2 scale-95"
            >
              <span
                v-if="copied"
                class="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1 text-xs text-white dark:bg-gray-200 dark:text-gray-800"
              >
                已复制!
              </span>
            </Transition>
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
