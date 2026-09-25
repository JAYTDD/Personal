<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

interface Project {
  name: string
  title: string
  description: string
  gradient: { from: string; to: string }
  language: string | null
  topics: string[]
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

// ===== Direction-aware glow: slides in from the mouse entry side, exits opposite =====
const glowStyle = ref<Record<string, string>>({})
let glowRaf = 0

const GLOW_OFF: Record<string, string> = {
  left: 'translate(-60%, 0)',
  right: 'translate(60%, 0)',
  top: 'translate(0, -60%)',
  bottom: 'translate(0, 60%)',
}

function entryDirection(e: MouseEvent, el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const x = e.clientX - (r.left + r.width / 2)
  const y = e.clientY - (r.top + r.height / 2)
  return Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : y > 0 ? 'bottom' : 'top'
}

function onCardEnter(e: MouseEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const dir = entryDirection(e, e.currentTarget as HTMLElement)
  glowStyle.value = { transform: GLOW_OFF[dir]!, opacity: '1', transition: 'none' }
  cancelAnimationFrame(glowRaf)
  glowRaf = requestAnimationFrame(() => {
    glowStyle.value = {
      transform: 'translate(0, 0)',
      opacity: '1',
      transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease',
    }
  })
}

function onCardLeave(e: MouseEvent) {
  const dir = entryDirection(e, e.currentTarget as HTMLElement)
  cancelAnimationFrame(glowRaf)
  glowStyle.value = {
    transform: GLOW_OFF[dir]!,
    opacity: '0',
    transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease',
  }
}

onUnmounted(() => cancelAnimationFrame(glowRaf))
</script>

<template>
  <article
    class="project-card-beam group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-default dark:border-border-dark bg-bg-primary dark:bg-bg-dark-secondary shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-transparent"
    :style="{ '--beam-color': project.gradient.from }"
    @mouseenter="onCardEnter"
    @mouseleave="onCardLeave"
  >
    <!-- Direction-aware glow: slides in from the pointer entry side -->
    <div class="dir-glow" aria-hidden="true" :style="glowStyle" />

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

<style lang="scss" scoped>
@property --beam-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

/* Direction-aware glow layer (oversized so sliding never reveals edges) */
.dir-glow {
  position: absolute;
  inset: -35%;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    42% 42% at 50% 50%,
    color-mix(in srgb, var(--beam-color, var(--color-brand-pink)) 28%, transparent),
    transparent 70%
  );
}

/* Border beam: a light streak orbiting the card border while hovered.
   Only runs during hover (no idle animation); transform/opacity elsewhere. */
.project-card-beam::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: conic-gradient(
    from var(--beam-angle),
    transparent 0%,
    transparent 70%,
    var(--beam-color, var(--color-brand-pink)) 85%,
    transparent 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease-out;
  pointer-events: none;
}

.project-card-beam:hover::before {
  opacity: 1;
  animation: beam-spin 2.6s linear infinite;
}

@keyframes beam-spin {
  to {
    --beam-angle: 360deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-beam:hover::before {
    animation: none;
    opacity: 0.6;
  }
}
</style>
