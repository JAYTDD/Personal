<script setup lang="ts">
import AppIcon from '@/components/icons/AppIcon.vue'

defineProps<{
  show: boolean
  message: string
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-3"
    >
      <div
        v-if="show"
        role="status"
        aria-live="polite"
        class="print-hide fixed bottom-8 left-1/2 z-[300] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-medium text-text-primary shadow-xl dark:border-border-dark dark:bg-bg-dark-secondary dark:text-text-dark-primary"
      >
        <AppIcon
          name="lucide:circle-check"
          class="h-4 w-4 shrink-0 text-status-success dark:text-status-success-dark"
        />
        <span class="text-text-secondary dark:text-text-dark-secondary">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>
