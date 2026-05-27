<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TopNavBar from '@/components/TopNavBar.vue'
import AppFooter from '@/components/Footer.vue'
import SakuraCanvas from '@/components/SakuraCanvas.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.init()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
    <SakuraCanvas />
    <TopNavBar />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style>
::selection {
  background-color: rgba(59, 130, 246, 0.2);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark ::-webkit-scrollbar-thumb {
  background: #52525b;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #71717a;
}

/* Enhanced page transitions */
.page-fade-enter-active {
  transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-fade-leave-active {
  transition: opacity 0.25s ease-in, transform 0.25s ease-in;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: opacity 0.1s ease-out;
  }

  .page-fade-enter-from,
  .page-fade-leave-to {
    transform: none;
  }
}
</style>
