<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { Icon } from '@iconify/vue'

const route = useRoute()
const themeStore = useThemeStore()
const isMenuOpen = ref(false)

const navItems = [
  { name: '首页', path: '/' },
  { name: '简历', path: '/resume' },
  { name: '经历', path: '/experience' },
  { name: '关于', path: '/about' },
]

const isActive = (path: string) => route.path === path

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-20 border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-700/30 dark:bg-zinc-950/70 supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-950/60"
  >
    <nav class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
      <!-- Brand + Nav Links -->
      <div class="flex items-center gap-6">
        <RouterLink
          to="/"
          class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
          @click="closeMenu"
        >
          resin-blog
        </RouterLink>

        <div class="hidden items-center gap-1 sm:flex">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="rounded-full px-3 py-1 text-sm transition-colors duration-200"
            :class="
              isActive(item.path)
                ? 'text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
            "
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button
          aria-label="切换主题"
          class="relative cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/60 bg-white/50 backdrop-blur-md shadow-sm text-zinc-600 hover:text-zinc-900 hover:bg-white/80 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700/60 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:focus:ring-zinc-500/30"
          @click="themeStore.toggle()"
        >
          <span class="sr-only">切换到暗色模式</span>
          <Icon icon="lucide:sun" class="absolute h-[18px] w-[18px] transition-all duration-300 ease-out rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
          <Icon icon="lucide:moon" class="absolute h-[18px] w-[18px] transition-all duration-300 ease-out rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
        </button>

        <!-- Hamburger (mobile) -->
        <button
          type="button"
          class="sm:hidden relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/60 bg-white/50 backdrop-blur-md shadow-sm text-zinc-600 hover:text-zinc-900 hover:bg-white/80 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700/60 transition-all duration-300 ease-out"
          aria-label="打开菜单"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <Icon icon="lucide:menu" class="h-4 w-4" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div
      v-show="isMenuOpen"
      class="sm:hidden border-t border-zinc-200/50 bg-white/95 backdrop-blur-xl dark:border-zinc-700/30 dark:bg-zinc-950/95 px-4 py-3"
    >
      <div class="flex flex-col gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="rounded-full px-3 py-2 text-sm transition-colors duration-200"
          :class="
            isActive(item.path)
              ? 'text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
          "
          @click="closeMenu"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>
