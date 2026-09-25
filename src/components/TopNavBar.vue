<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import AppIcon from '@/components/icons/AppIcon.vue'
import { NAV_ITEMS, SITE_BRAND } from '@/data/site'
import { prefetchView } from '@/utils/prefetchView'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)
/** Route navigation indicator (when chunk not yet cached) */
const navProgress = ref(0)
let navHideTimer: ReturnType<typeof setTimeout> | null = null

const navItems = NAV_ITEMS

const isActive = (path: string) => route.path === path

const themeLabel = computed(() => (themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'))

// ===== Active nav pill — slides between links (transform-only, no layout anim) =====
const pillReady = ref(false)
const pillStyle = ref<{ transform: string; width: string }>({
  transform: 'translateX(0px)',
  width: '0px',
})
const linkEls = new Map<string, HTMLElement>()

function setLinkRef(path: string, el: unknown) {
  // RouterLink is a component: the ref yields the component instance, so unwrap $el
  const target =
    el instanceof HTMLElement ? el : (el as { $el?: unknown } | null)?.$el
  if (target instanceof HTMLElement) linkEls.set(path, target)
  else linkEls.delete(path)
}

function movePill() {
  const el = linkEls.get(route.path)
  if (!el) {
    // Current route has no nav item (e.g. 404) — collapse the pill away
    pillStyle.value = { ...pillStyle.value, width: '0px' }
    return
  }
  pillStyle.value = {
    transform: `translateX(${el.offsetLeft}px)`,
    width: `${el.offsetWidth}px`,
  }
}

watch(
  () => route.path,
  async () => {
    await nextTick()
    movePill()
  },
)

// ===== Theme toggle with circular reveal (View Transitions API) =====
function onThemeToggle(e: MouseEvent) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || typeof document.startViewTransition !== 'function') {
    themeStore.toggle()
    return
  }
  const x = e.clientX
  const y = e.clientY
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const transition = document.startViewTransition(() => themeStore.toggle())
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
    .catch(() => {
      // ready rejects when a newer transition supersedes this one — safe to ignore
    })
}

function closeMenu() {
  isMenuOpen.value = false
}

function onPrefetch(path: string) {
  prefetchView(path)
}

/** Prefer nav progress when navigating; else scroll progress */
const barWidth = computed(() =>
  navProgress.value > 0 ? navProgress.value : scrollProgress.value,
)

let scrollTicking = false

function updateScroll() {
  isScrolled.value = window.scrollY > 20
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
  scrollTicking = false
}

function handleScroll() {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(updateScroll)
}

function handlePillResize() {
  movePill()
}

const removeBefore = router.beforeEach((to, from) => {
  if (to.path === from.path) return
  if (navHideTimer) {
    clearTimeout(navHideTimer)
    navHideTimer = null
  }
  navProgress.value = 12
})

const removeAfter = router.afterEach(() => {
  navProgress.value = 100
  navHideTimer = setTimeout(() => {
    navProgress.value = 0
  }, 200)
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  updateScroll()

  movePill()
  // Enable the slide transition only after the first no-transition placement
  requestAnimationFrame(() => {
    pillReady.value = true
  })
  window.addEventListener('resize', handlePillResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handlePillResize)
  removeBefore()
  removeAfter()
  if (navHideTimer) clearTimeout(navHideTimer)
})
</script>

<template>
  <header
    class="print-hide sticky top-0 z-20 transition-all duration-300 ease-out"
    :class="{
      'border-b border-border-default bg-bg-primary/70 backdrop-blur-xl dark:border-border-dark dark:bg-bg-dark-primary/70': !isScrolled,
      'border-b border-border-hover bg-bg-primary/90 backdrop-blur-xl shadow-sm dark:border-border-dark-hover dark:bg-bg-dark-primary/90': isScrolled,
    }"
  >
    <!-- Scroll / route progress bar -->
    <div
      class="absolute bottom-0 left-0 h-[2px] bg-brand-pink dark:bg-brand-pink-light transition-[width] duration-200 ease-out"
      :style="{ width: barWidth + '%' }"
    />

    <nav aria-label="主导航" class="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
      <!-- Brand + Nav Links -->
      <div class="flex items-center gap-7">
        <RouterLink
          to="/"
          class="text-xl font-semibold tracking-tight text-text-primary dark:text-text-dark-primary transition-transform duration-200 hover:scale-105"
          @mouseenter="onPrefetch('/')"
          @focus="onPrefetch('/')"
          @click="closeMenu"
        >
          {{ SITE_BRAND }}
        </RouterLink>

        <div class="relative hidden items-center gap-1.5 sm:flex">
          <!-- Sliding active pill (decorative; sits behind link text) -->
          <span
            aria-hidden="true"
            class="nav-pill"
            :class="{ ready: pillReady }"
            :style="pillStyle"
          />
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :ref="(el) => setLinkRef(item.path, el)"
            :to="item.path"
            class="relative rounded-full px-3.5 py-1.5 text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40 dark:focus-visible:ring-brand-pink-light/40"
            :aria-current="isActive(item.path) ? 'page' : undefined"
            :class="
              isActive(item.path)
                ? 'text-text-primary dark:text-text-dark-primary font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary/60'
            "
            @mouseenter="onPrefetch(item.path)"
            @focus="onPrefetch(item.path)"
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
          class="relative cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-bg-secondary/50 backdrop-blur-md shadow-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:border-border-dark dark:bg-bg-dark-secondary/50 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-pink/30 dark:focus:ring-brand-pink-light/30 hover:scale-105 active:scale-95"
          @click="onThemeToggle"
        >
          <span class="sr-only">{{ themeLabel }}</span>
          <AppIcon name="sun" class="absolute h-5 w-5 transition-all duration-300 ease-out rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
          <AppIcon name="moon" class="absolute h-5 w-5 transition-all duration-300 ease-out rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
        </button>

        <!-- Hamburger (mobile) — animates to X -->
        <button
          type="button"
          class="sm:hidden relative flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-bg-secondary/50 backdrop-blur-md shadow-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:border-border-dark dark:bg-bg-dark-secondary/50 dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary transition-all duration-300 ease-out hover:scale-105 active:scale-95"
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
            class="rounded-full px-3.5 py-2.5 text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
            :aria-current="isActive(item.path) ? 'page' : undefined"
            :class="
              isActive(item.path)
                ? 'text-text-primary dark:text-text-dark-primary bg-bg-secondary dark:bg-bg-dark-secondary font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-bg-dark-secondary'
            "
            @mouseenter="onPrefetch(item.path)"
            @focus="onPrefetch(item.path)"
            @click="closeMenu"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.nav-pill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 9999px;
  background: var(--color-bg-secondary);

  html.dark & {
    background: var(--color-bg-dark-secondary);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .nav-pill.ready {
    transition:
      transform 0.35s cubic-bezier(0.32, 0.72, 0, 1),
      width 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  }
}
</style>
