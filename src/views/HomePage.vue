<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import GitHubContributions from '@/components/GitHubContributions.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { Icon } from '@iconify/vue'
import { computed, ref, onMounted } from 'vue'
import { useGithubRepos, getLanguageGradient, formatRepoName } from '@/composables/useGithubRepos'

const { repos, loading, error, fetchRepos } = useGithubRepos()

const cardProjects = computed(() =>
  repos.value.map((r) => {
    const gradient = getLanguageGradient(r.language)
    return {
      name: r.name,
      title: formatRepoName(r.name),
      description:
        r.description || (r.language ? `一个基于 ${r.language} 的开源项目` : '一个开源项目'),
      gradient,
      language: r.language,
      topics: r.topics,
      stars: r.stargazers_count,
      github: r.html_url,
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
        <div class="mx-auto max-w-4xl px-4">
          <GitHubContributions />
        </div>
      </section>

      <!-- Projects Section -->
      <section ref="projectsSectionRef" class="relative z-10 pb-20 projects-section">
        <div class="mx-auto max-w-4xl px-4">
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

          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              v-for="i in 4"
              :key="'skeleton-' + i"
              class="aspect-[6/4] rounded-xl overflow-hidden bg-bg-secondary dark:bg-bg-dark-secondary animate-pulse"
            >
              <div class="h-full w-full flex flex-col justify-end p-5">
                <div class="h-5 w-2/3 bg-bg-tertiary dark:bg-bg-dark-tertiary rounded mb-2" />
                <div class="h-3 w-full bg-bg-tertiary dark:bg-bg-dark-tertiary rounded mb-3" />
                <div class="flex gap-2">
                  <div class="h-5 w-14 bg-bg-tertiary dark:bg-bg-dark-tertiary rounded-full" />
                  <div class="h-5 w-14 bg-bg-tertiary dark:bg-bg-dark-tertiary rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-16">
            <Icon
              icon="lucide:circle-alert"
              class="w-10 h-10 mx-auto mb-3 text-text-tertiary dark:text-text-dark-tertiary"
            />
            <p class="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
              {{ error }}
            </p>
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium text-text-inverse bg-bg-inverse dark:bg-bg-primary dark:text-text-primary hover:opacity-90 transition-opacity cursor-pointer"
              @click="fetchRepos"
            >
              重新加载
            </button>
          </div>

          <!-- Project Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style="perspective: 1000px">
            <ProjectCard
              v-for="(project, index) in cardProjects"
              :key="project.name"
              :project="project"
              :index="index"
              class="transition-all duration-700 ease-out"
              :class="{
                'opacity-0 translate-y-8': !projectsVisible,
                'opacity-100 translate-y-0': projectsVisible,
              }"
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
              href="https://github.com/JAYTDD?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm text-text-secondary dark:text-text-dark-secondary hover:text-brand-pink dark:hover:text-brand-pink-light transition-colors duration-200"
            >
              查看全部项目
              <Icon icon="lucide:arrow-right" class="w-4 h-4" />
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
