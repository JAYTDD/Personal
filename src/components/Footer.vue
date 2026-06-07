<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

const currentYear = new Date().getFullYear()
const copied = ref(false)

const navLinks = [
  { name: '首页', path: '/' },
  { name: '简历', path: '/resume' },
  { name: '经历', path: '/experience' },
  { name: '关于', path: '/about' },
]

const socialLinks = [
  { icon: 'simple-icons:github', title: 'GitHub', href: 'https://github.com/JAYTDD', external: true },
  { icon: 'simple-icons:juejin', title: '掘金', href: 'https://juejin.cn/user/2385290407448745', external: true },
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
  <footer class="bg-bg-primary dark:bg-bg-dark-primary border-t border-border-default dark:border-border-dark">
    <div class="mx-auto max-w-4xl px-4 py-10">
      <!-- Top: Nav + Social -->
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:items-center">
        <!-- Left: Nav links -->
        <nav aria-label="页脚导航" class="flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="relative text-sm text-text-secondary transition-all duration-200 hover:text-text-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary group"
          >
            {{ link.name }}
            <span class="absolute -bottom-1 left-0 w-0 h-px bg-brand-pink dark:bg-brand-pink-light transition-all duration-200 group-hover:w-full" />
          </RouterLink>
        </nav>

        <!-- Right: Social icons + FAB -->
        <div class="flex items-center gap-4">
          <a
            v-for="link in socialLinks"
            :key="link.icon"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-tertiary transition-all duration-200 hover:text-brand-pink hover:scale-110 dark:text-text-dark-tertiary dark:hover:text-brand-pink-light"
            :title="link.title"
            :aria-label="link.title"
          >
            <Icon :icon="link.icon" class="h-5 w-5" />
          </a>

          <!-- FAB Share Button -->
          <button
            type="button"
            class="relative flex h-12 w-12 items-center justify-center rounded-full gradient-pink shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-3 active:scale-95"
            title="分享链接"
            aria-label="分享链接"
            @click="copyUrl"
          >
            <Icon icon="lucide:arrow-up-right" class="h-5 w-5 text-white transition-transform duration-200" :class="{ 'rotate-45': copied }" />
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
                class="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-bg-inverse dark:bg-bg-primary px-2.5 py-1 text-xs text-text-inverse dark:text-text-primary"
              >
                已复制!
              </span>
            </Transition>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="my-6 border-t border-border-default dark:border-border-dark" />

      <!-- Bottom: Copyright -->
      <p class="text-center text-sm text-text-tertiary dark:text-text-dark-tertiary">
        &copy; {{ currentYear }} Resin. All rights reserved.
      </p>
    </div>
  </footer>
</template>
