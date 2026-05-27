<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import ProjectCard from '@/components/ProjectCard.vue'
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
</script>

<template>
  <div class="relative z-10">
    <div class="mx-auto max-w-4xl px-4 py-16">
      <h1 class="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-2">项目展示</h1>
      <p class="text-text-secondary dark:text-text-dark-secondary mb-8">一些正在维护的开源项目</p>

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
        <Icon icon="lucide:alert-circle" class="w-10 h-10 mx-auto mb-3 text-text-tertiary dark:text-text-dark-tertiary" />
        <p class="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">{{ error }}</p>
        <button
          class="px-4 py-2 rounded-lg text-sm font-medium text-text-inverse bg-bg-inverse dark:bg-bg-primary dark:text-text-primary hover:opacity-90 transition-opacity cursor-pointer"
          @click="fetchRepos"
        >
          重新加载
        </button>
      </div>

      <!-- Project Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6" style="perspective: 1000px;">
        <ProjectCard
          v-for="(project, index) in cardProjects"
          :key="project.name"
          :project="project"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>
