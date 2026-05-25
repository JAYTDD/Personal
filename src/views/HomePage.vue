<script setup lang="ts">
import SakuraCanvas from '@/components/SakuraCanvas.vue'
import HeroSection from '@/components/HeroSection.vue'
import GitHubContributions from '@/components/GitHubContributions.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { Icon } from '@iconify/vue'
import { computed, ref, onMounted } from 'vue'
import {
  useGithubRepos,
  getLanguageGradient,
  formatRepoName,
} from '@/composables/useGithubRepos'

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
  })
)

// Scroll reveal for sections
const projectsSectionRef = ref<HTMLElement | null>(null)
const projectsVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        projectsVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  if (projectsSectionRef.value) {
    observer.observe(projectsSectionRef.value)
  }
})
</script>

<template>
  <div class="relative">
    <!-- Sakura Canvas -->
    <SakuraCanvas />

    <!-- Hero Section -->
    <HeroSection />

    <!-- GitHub Contributions -->
    <GitHubContributions />

    <!-- Projects Section -->
    <section ref="projectsSectionRef" class="relative z-10 pb-20">
      <div class="mx-auto max-w-4xl px-4">
        <div
          class="transition-all duration-700 ease-out"
          :class="{
            'opacity-0 translate-y-8': !projectsVisible,
            'opacity-100 translate-y-0': projectsVisible,
          }"
        >
          <h2 class="text-xl font-semibold tracking-wide text-zinc-700 dark:text-zinc-300 text-center mb-2">
            项目展示
          </h2>
          <p class="text-sm text-zinc-400 dark:text-zinc-500 text-center mb-8">
            一些正在维护的开源项目
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div
            v-for="i in 4"
            :key="'skeleton-' + i"
            class="aspect-[6/4] rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 animate-pulse"
          >
            <div class="h-full w-full flex flex-col justify-end p-5">
              <div class="h-5 w-2/3 bg-zinc-300 dark:bg-zinc-700 rounded mb-2" />
              <div class="h-3 w-full bg-zinc-300 dark:bg-zinc-700 rounded mb-3" />
              <div class="flex gap-2">
                <div class="h-5 w-14 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                <div class="h-5 w-14 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="text-center py-16"
        >
          <Icon icon="lucide:alert-circle" class="w-10 h-10 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
          <p class="text-sm text-zinc-400 dark:text-zinc-500 mb-4">{{ error }}</p>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-800 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors cursor-pointer"
            @click="fetchRepos"
          >
            重新加载
          </button>
        </div>

        <!-- Project Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 gap-6"
          style="perspective: 1000px;"
        >
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
            :style="{ transitionDelay: `${index * 100}ms` }"
          />
        </div>
      </div>
    </section>
  </div>
</template>
