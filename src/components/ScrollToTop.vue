<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const visible = ref(false)
let ticking = false

function update() {
  visible.value = window.scrollY > 400
  ticking = false
}

function handleScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-90"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-90"
  >
    <button
      v-show="visible"
      aria-label="回到顶部"
      class="fixed bottom-6 right-6 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-bg-primary/80 dark:bg-bg-dark-primary/80 border border-border-default dark:border-border-dark backdrop-blur-md shadow-lg text-text-secondary dark:text-text-dark-secondary hover:text-brand-pink dark:hover:text-brand-pink-light hover:border-brand-pink/30 dark:hover:border-brand-pink-light/30 transition-colors duration-200 cursor-pointer active:scale-90"
      @click="scrollToTop"
    >
      <AppIcon name="arrow-up" class="w-4 h-4" />
    </button>
  </Transition>
</template>
