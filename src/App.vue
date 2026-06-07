<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TopNavBar from '@/components/TopNavBar.vue'
import AppFooter from '@/components/Footer.vue'
import SakuraCanvas from '@/components/SakuraCanvas.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const route = useRoute()

// Route order for direction-aware transitions
const routeOrder: Record<string, number> = {
  '/': 0,
  '/resume': 1,
  '/experience': 2,
  '/about': 3,
}

const transitionName = ref('page-fade')
const prevOrder = ref(0)

watch(
  () => route.path,
  (to) => {
    const toOrder = routeOrder[to] ?? 0
    transitionName.value = toOrder >= prevOrder.value ? 'page-slide-left' : 'page-slide-right'
    prevOrder.value = toOrder
  },
)

onMounted(() => {
  themeStore.init()
  prevOrder.value = routeOrder[route.path] ?? 0
})
</script>

<template>
  <div class="relative flex flex-col min-h-screen bg-white dark:bg-zinc-950">
    <div
      v-if="route.path === '/'"
      class="pointer-events-none fixed inset-0 z-[-20] bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.12)_0%,rgba(236,72,153,0.06)_22%,rgba(236,72,153,0.02)_42%,transparent_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.1)_0%,rgba(244,114,182,0.05)_22%,rgba(244,114,182,0.015)_42%,transparent_70%)]"
    />
    <div
      v-if="route.path === '/'"
      class="pointer-events-none fixed inset-0 z-[-20] bg-[linear-gradient(to_bottom,rgba(250,250,248,0.65),rgba(250,250,248,0.15)_18%,transparent_36%,transparent_64%,rgba(250,250,248,0.1)_82%,rgba(250,250,248,0.75))] dark:bg-[linear-gradient(to_bottom,rgba(15,15,16,0.72),rgba(15,15,16,0.18)_18%,transparent_36%,transparent_64%,rgba(15,15,16,0.12)_82%,rgba(15,15,16,0.78))]"
    />

    <SakuraCanvas />

    <TopNavBar />
    <main class="relative z-10 flex-1">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-default, #E4E4E7);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover, #D4D4D8);
}

.dark ::-webkit-scrollbar-thumb {
  background: var(--color-border-dark, #27272A);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-dark-hover, #3F3F46);
}

/* Slide left (forward navigation) */
.page-slide-left-enter-active {
  transition: opacity 0.35s ease-out, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-slide-left-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.page-slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.page-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* Slide right (backward navigation) */
.page-slide-right-enter-active {
  transition: opacity 0.35s ease-out, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-slide-right-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.page-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}
.page-slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .page-slide-left-enter-active,
  .page-slide-left-leave-active,
  .page-slide-right-enter-active,
  .page-slide-right-leave-active {
    transition: opacity 0.1s ease-out;
  }
  .page-slide-left-enter-from,
  .page-slide-left-leave-to,
  .page-slide-right-enter-from,
  .page-slide-right-leave-to {
    transform: none;
  }
}
</style>
