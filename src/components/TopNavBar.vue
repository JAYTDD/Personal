<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { Icon } from '@iconify/vue'

const route = useRoute()
const themeStore = useThemeStore()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

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

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="sticky top-0 z-20 transition-all duration-300 ease-out"
    :class="{
      'border-b border-border-default bg-bg-primary/70 backdrop-blur-xl dark:border-border-dark dark:bg-bg-dark-primary/70': !isScrolled,
      'border-b border-border-hover bg-bg-primary/90 backdrop-blur-xl shadow-sm dark:border-border-dark-hover dark:bg-bg-dark-primary/90': isScrolled,
    }"
  >
    <nav class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
      <!-- Brand + Nav Links -->
      <div class="flex items-center gap-6">
        <RouterLink
          to="/"
          class="text-lg font-semibold tracking-tight text-text-primary dark:text-text-dark-primary transition-transform duration-200 hover:scale-105"
          @click="closeMenu"
        >
          resin-blog
        </RouterLink>

        <div class="hidden items-center gap-1 sm:flex">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="relative rounded-full px-3 py-1 text-sm transition-all duration-200"
            :class="
              isActive(item.path)
                ? 'text-text-primary dark:text-text-dark-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary'
            "
          >
            {{ item.name }}
            <!-- Active indicator dot -->
            <span
              v-if="isActive(item.path)"
              class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-pink dark:bg-brand-pink-light transition-all duration-300"
            />
          </RouterLink>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button
          aria-label="切换主题"
          class="relative cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-secondary/50 backdrop-blur-md shadow-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:border-border-dark dark:bg-bg-dark-secondary/50 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-pink/30 dark:focus:ring-brand-pink-light/30 hover:scale-105 active:scale-95"
          @click="themeStore.toggle()"
        >
          <span class="sr-only">切换到暗色模式</span>
          <Icon icon="lucide:sun" class="absolute h-[18px] w-[18px] transition-all duration-300 ease-out rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
          <Icon icon="lucide:moon" class="absolute h-[18px] w-[18px] transition-all duration-300 ease-out rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
        </button>

        <!-- Hamburger (mobile) -->
        <button
          type="button"
          class="sm:hidden relative flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-secondary/50 backdrop-blur-md shadow-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:border-border-dark dark:bg-bg-dark-secondary/50 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          aria-label="打开菜单"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <Icon icon="lucide:menu" class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-90': isMenuOpen }" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu with slide animation -->
    <div
      v-show="isMenuOpen"
      class="sm:hidden border-t border-border-default bg-bg-primary/95 backdrop-blur-xl dark:border-border-dark dark:bg-bg-dark-primary/95 px-4 py-3 transition-all duration-300 ease-out"
      :class="{
        'opacity-0 -translate-y-2': !isMenuOpen,
        'opacity-100 translate-y-0': isMenuOpen,
      }"
    >
      <div class="flex flex-col gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="rounded-full px-3 py-2 text-sm transition-all duration-200"
          :class="
            isActive(item.path)
              ? 'text-text-primary dark:text-text-dark-primary bg-bg-secondary dark:bg-bg-dark-secondary'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary'
          "
          @click="closeMenu"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>
