<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import ProjectShowcase from '@/components/ProjectShowcase.vue'
import DecodeText from '@/components/DecodeText.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import { getLanguageGradient } from '@/utils/languageGradient'
import { PROJECTS } from '@/data/projects'
import { GITHUB_LOGIN } from '@/data/site'
import { useScrollReveal } from '@/composables/useScrollReveal'

// Below-fold: own chunk; API still viewport-gated inside the component.
// Section min-height reserves space while the async chunk loads (limits CLS).
const GitHubContributions = defineAsyncComponent(
  () => import('@/components/GitHubContributions.vue'),
)

const cardProjects = computed(() =>
  [...PROJECTS]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .map((p) => {
      const gradient = getLanguageGradient(p.language)
      return {
        name: p.name,
        title: p.title,
        description: p.description,
        gradient,
        language: p.language,
        topics: p.topics,
        github: p.html_url,
        period: p.period,
        stack: p.stack,
      }
    }),
)

// Scroll reveal for sections
const projectsVisible = ref(false)
const projectsStacked = ref(false)

useScrollReveal({
  selector: '.projects-section',
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  once: true,
  onReveal: () => {
    projectsVisible.value = true
  },
})
</script>

<template>
  <div class="relative min-h-screen isolate bg-bg-primary dark:bg-bg-dark-primary">
    <div class="relative z-10">
      <!-- Hero Section -->
      <HeroSection />

      <!-- GitHub Contributions (async chunk + min-height to limit CLS) -->
      <section class="relative z-10 py-8 min-h-[280px]">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <GitHubContributions />
        </div>
      </section>

      <!-- Projects Section -->
      <section class="relative z-10 pb-20 projects-section" :class="{ 'is-stacked': projectsStacked }">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            class="transition-all duration-700 ease-out"
            :class="{
              'opacity-0 translate-y-8': !projectsVisible,
              'opacity-100 translate-y-0': projectsVisible,
            }"
          >
            <h2
              class="text-xl font-semibold tracking-wide text-text-primary dark:text-text-dark-primary text-center mb-2"
            >
              <DecodeText text="项目展示" />
            </h2>
            <p class="text-sm text-text-secondary dark:text-text-dark-secondary text-center mb-8">
              一些正在维护的开源项目
            </p>
          </div>

          <ProjectShowcase
            :projects="cardProjects"
            :revealed="projectsVisible"
            @mode-change="projectsStacked = $event"
          />

          <!-- View All CTA -->
          <div
            class="mt-8 text-center transition-all duration-700 ease-out"
            :class="{
              'opacity-0 translate-y-4': !projectsVisible,
              'opacity-100 translate-y-0': projectsVisible,
            }"
          >
            <a
              :href="`https://github.com/${GITHUB_LOGIN}?tab=repositories`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm text-text-secondary dark:text-text-dark-secondary hover:text-brand-pink dark:hover:text-brand-pink-light transition-colors duration-200"
            >
              查看全部项目
              <AppIcon name="lucide:arrow-right" class="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.projects-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px;
}
.projects-section.is-stacked {
  content-visibility: visible;
  contain-intrinsic-size: none;
}
</style>
