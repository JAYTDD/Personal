<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

interface Project {
  name: string
  title: string
  description: string
  gradient: { from: string; to: string }
  language: string | null
  topics: string[]
  stars: number
  github: string
  period?: string
  stack?: string
}

const props = defineProps<{
  project: Project
}>()

/** 技术栈拆成标签，最多展示 5 个；无 stack 时回退 topics */
const stackTags = computed(() => {
  if (props.project.stack) {
    return props.project.stack
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5)
  }
  return props.project.topics.slice(0, 4)
})
</script>

<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-default dark:border-border-dark bg-bg-primary dark:bg-bg-dark-secondary shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-transparent"
  >
    <!-- Top accent bar -->
    <div
      class="h-1.5 w-full shrink-0"
      :style="{
        background: `linear-gradient(90deg, ${project.gradient.from}, ${project.gradient.to})`,
      }"
    />

    <!-- Soft corner glow -->
    <div
      class="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-[0.12] blur-2xl transition-opacity duration-300 group-hover:opacity-25"
      :style="{ background: project.gradient.from }"
    />

    <div class="relative flex flex-1 flex-col p-5 sm:p-6">
      <!-- Header: language + period -->
      <div class="mb-3 flex items-center justify-between gap-3">
        <div
          v-if="project.language"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
          :style="{
            color: project.gradient.from,
            backgroundColor: `${project.gradient.from}14`,
          }"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :style="{ background: project.gradient.from }"
          />
          {{ project.language }}
        </div>
        <div
          v-if="project.period"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-text-tertiary dark:text-text-dark-tertiary tabular-nums"
        >
          <AppIcon name="lucide:calendar" :width="11" :height="11" />
          <span>{{ project.period }}</span>
        </div>
        <div
          v-else-if="project.stars > 0"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-text-tertiary dark:text-text-dark-tertiary"
        >
          <AppIcon name="lucide:star" :width="12" :height="12" />
          <span>{{ project.stars }}</span>
        </div>
        <div v-else class="h-5" />
      </div>

      <!-- Title -->
      <h3
        class="mb-2 text-lg font-semibold leading-snug tracking-tight text-text-primary dark:text-text-dark-primary line-clamp-2 transition-colors duration-200 group-hover:text-brand-pink dark:group-hover:text-brand-pink-light"
      >
        {{ project.title }}
      </h3>

      <!-- Description -->
      <p
        class="mb-4 flex-1 text-sm leading-relaxed text-text-secondary dark:text-text-dark-secondary line-clamp-3"
      >
        {{ project.description }}
      </p>

      <!-- Stack / topic tags -->
      <div v-if="stackTags.length" class="mb-4 flex flex-wrap gap-1.5">
        <span
          v-for="tag in stackTags"
          :key="tag"
          class="rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide text-text-tertiary dark:text-text-dark-tertiary bg-bg-secondary dark:bg-bg-dark-tertiary border border-border-default/60 dark:border-border-dark"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Footer action -->
      <div
        class="mt-auto flex items-center justify-between border-t border-border-default/70 dark:border-border-dark pt-4"
      >
        <a
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200 hover:text-brand-pink dark:hover:text-brand-pink-light"
          :aria-label="'查看 ' + project.title + ' 的 GitHub 仓库'"
          @click.stop
        >
          <AppIcon name="github" class="w-4 h-4" />
          <span>GitHub</span>
        </a>
        <a
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary dark:text-text-dark-tertiary transition-all duration-200 hover:bg-bg-secondary dark:hover:bg-bg-dark-tertiary hover:text-brand-pink dark:hover:text-brand-pink-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          :aria-label="'打开 ' + project.title"
          @click.stop
        >
          <AppIcon name="lucide:arrow-up-right" class="w-4 h-4" />
        </a>
      </div>
    </div>
  </article>
</template>
