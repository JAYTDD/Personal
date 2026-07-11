<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import GitHubContributions from '@/components/GitHubContributions.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import { computed, ref, onMounted } from 'vue'
import { getLanguageGradient } from '@/composables/useGithubRepos'
import { PROJECTS } from '@/data/projects'
import { GITHUB_LOGIN } from '@/data/site'

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
        stars: p.stargazers_count,
        github: p.html_url,
        period: p.period,
        stack: p.stack,
      }
    }),
)

// Scroll reveal for sections
const projectsSectionRef = ref<HTMLElement | null>(null)
const projectsVisible = ref(false)

onMounted(() => {
  const el = projectsSectionRef.value
  if (el) {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      projectsVisible.value = true
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            projectsVisible.value = true
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      )
      observer.observe(el)
    }
  }
})
</script>

<template>
  <div class="relative min-h-screen isolate bg-bg-primary dark:bg-bg-dark-primary">
    <div class="relative z-10">
      <!-- Hero Section -->
      <HeroSection />

      <!-- GitHub Contributions -->
      <section class="relative z-10 py-8">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <GitHubContributions />
        </div>
      </section>

      <!-- Projects Section -->
      <section ref="projectsSectionRef" class="relative z-10 pb-20 projects-section">
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
              项目展示
            </h2>
            <p class="text-sm text-text-secondary dark:text-text-dark-secondary text-center mb-8">
              一些正在维护的开源项目
            </p>
          </div>

          <!-- Project Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            <ProjectCard
              v-for="(project, index) in cardProjects"
              :key="project.name"
              :project="project"
              :index="index"
              class="transition-all duration-700 ease-out h-full"
              :class="{
                'opacity-0 translate-y-8': !projectsVisible,
                'opacity-100 translate-y-0': projectsVisible,
              }"
              :style="{ transitionDelay: `${index * 60}ms` }"
            />
          </div>

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
</style>
