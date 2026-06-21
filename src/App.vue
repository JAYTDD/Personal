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
// - Initial mount: stay on 'page-fade' so the appear animation runs
// - Subsequent navigations: slide left/right based on previous order
const routeOrder: Record<string, number> = {
  '/': 0,
  '/resume': 1,
  '/experience': 2,
  '/about': 3,
}

const initialOrder = routeOrder[route.path] ?? 0
const transitionName = ref('page-fade')
const prevOrder = ref(initialOrder)

watch(
  () => route.path,
  (to) => {
    const toOrder = routeOrder[to] ?? 0
    // Skip the first trigger that fires right after mount with the same path
    if (toOrder === prevOrder.value) return
    transitionName.value =
      toOrder >= prevOrder.value ? 'page-slide-left' : 'page-slide-right'
    prevOrder.value = toOrder
  },
)

onMounted(() => {
  themeStore.init()
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
        <Transition :name="transitionName" mode="out-in" appear>
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<style lang="scss">
@use './styles/animations' as anim;

// Scrollbar
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-default);
  border-radius: 3px;

  &:hover {
    background: var(--color-border-hover);
  }
}

.dark ::-webkit-scrollbar-thumb {
  background: var(--color-border-dark);

  &:hover {
    background: var(--color-border-dark-hover);
  }
}

// ===== Initial page entry (refresh / first load) =====
// Heavy fade-up + blur using swift-out cubic-bezier
.page-fade-appear-from {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(10px);
}

.page-fade-appear-active {
  transition:
    opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;
}

.page-fade-appear-to {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

// ===== Slide left (forward navigation) =====
.page-slide-left-enter-active {
  transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-slide-left-leave-active {
  transition: opacity 0.25s cubic-bezier(0.32, 0.72, 0, 1), transform 0.25s cubic-bezier(0.32, 0.72, 0, 1), filter 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.page-slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.page-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-24px);
  filter: blur(4px);
}

// ===== Slide right (backward navigation) =====
.page-slide-right-enter-active {
  transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-slide-right-leave-active {
  transition: opacity 0.25s cubic-bezier(0.32, 0.72, 0, 1), transform 0.25s cubic-bezier(0.32, 0.72, 0, 1), filter 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.page-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.page-slide-right-leave-to {
  opacity: 0;
  transform: translateX(24px);
  filter: blur(4px);
}

// Reduced motion support
@include anim.reduced-motion {
  .page-fade-appear-from,
  .page-fade-appear-to {
    transform: none;
    filter: none;
  }

  .page-fade-appear-active {
    transition: opacity 0.15s ease-out;
  }

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
    filter: none;
  }
}
</style>
