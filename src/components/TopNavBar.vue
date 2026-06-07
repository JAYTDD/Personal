<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { Icon } from '@iconify/vue'

const route = useRoute()
const themeStore = useThemeStore()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)

const navItems = [
  { name: '首页', path: '/' },
  { name: '简历', path: '/resume' },
  { name: '经历', path: '/experience' },
  { name: '关于', path: '/about' },
]

const isActive = (path: string) => route.path === path

const themeLabel = computed(() => (themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'))

function closeMenu() {
  isMenuOpen.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
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
    <!-- Scroll progress bar -->
    <div class="absolute bottom-0 left-0 h-[2px] bg-brand-pink dark:bg-brand-pink-light transition-none" :style="{ width: scrollProgress + '%' }" />

    <nav aria-label="主导航" class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
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
                ? 'text-text-primary dark:text-text-dark-primary bg-bg-secondary dark:bg-bg-dark-secondary font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary/60'
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
          :aria-label="themeLabel"
          class="relative cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-secondary/50 backdrop-blur-md shadow-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:border-border-dark dark:bg-bg-dark-secondary/50 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-pink/30 dark:focus:ring-brand-pink-light/30 hover:scale-105 active:scale-95"
          @click="themeStore.toggle()"
        >
          <span class="sr-only">{{ themeLabel }}</span>
          <Icon icon="lucide:sun" class="absolute h-[18px] w-[18px] transition-all duration-300 ease-out rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
          <Icon icon="lucide:moon" class="absolute h-[18px] w-[18px] transition-all duration-300 ease-out rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
        </button>

        <!-- Hamburger (mobile) — animates to X -->
        <button
          type="button"
          class="sm:hidden relative flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-secondary/50 backdrop-blur-md shadow-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:border-border-dark dark:bg-bg-dark-secondary/50 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          :aria-label="isMenuOpen ? '关闭菜单' : '打开菜单'"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="flex h-4 w-4 flex-col items-center justify-center gap-[5px]">
            <span class="block h-[1.5px] w-4 rounded-full bg-current transition-all duration-300 ease-out" :class="isMenuOpen ? 'translate-y-[0px] rotate-45' : '-translate-y-[3.25px]'" />
            <span class="block h-[1.5px] w-4 rounded-full bg-current transition-all duration-300 ease-out" :class="isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'" />
            <span class="block h-[1.5px] w-4 rounded-full bg-current transition-all duration-300 ease-out" :class="isMenuOpen ? 'translate-y-[0px] -rotate-45' : 'translate-y-[3.25px]'" />
          </span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isMenuOpen"
        class="fixed inset-0 z-[-1] bg-black/20 backdrop-blur-sm sm:hidden"
        @click="closeMenu"
      />
    </Transition>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out overflow-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-60"
      leave-active-class="transition-all duration-200 ease-in overflow-hidden"
      leave-from-class="opacity-100 max-h-60"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-show="isMenuOpen"
        class="sm:hidden border-t border-border-default bg-bg-primary/95 backdrop-blur-xl dark:border-border-dark dark:bg-bg-dark-primary/95 px-4 py-3"
      >
        <div class="flex flex-col gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="rounded-full px-3 py-2 text-sm transition-all duration-200"
            :class="
              isActive(item.path)
                ? 'text-text-primary dark:text-text-dark-primary bg-bg-secondary dark:bg-bg-dark-secondary font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary'
            "
            @click="closeMenu"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
