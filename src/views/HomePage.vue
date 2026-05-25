<script setup lang="ts">
import SakuraCanvas from '@/components/SakuraCanvas.vue'
import HeroSection from '@/components/HeroSection.vue'
import GitHubContributions from '@/components/GitHubContributions.vue'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
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
  <div class="relative">
    <!-- Sakura Canvas -->
    <SakuraCanvas />

    <!-- Hero Section -->
    <HeroSection />

    <!-- GitHub Contributions -->
    <GitHubContributions />

    <!-- Projects Section -->
    <section class="relative z-10 pb-20">
      <div class="mx-auto max-w-4xl px-4">
        <h2 class="text-xl font-semibold tracking-wide text-zinc-700 dark:text-zinc-300 text-center mb-2">
          项目展示
        </h2>
        <p class="text-sm text-zinc-400 dark:text-zinc-500 text-center mb-8">
          一些正在维护的开源项目
        </p>

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
        >
          <article
            v-for="project in cardProjects"
            :key="project.name"
            class="group relative aspect-[6/4] rounded-xl overflow-hidden shadow-lg cursor-pointer"
          >
            <!-- Gradient Background -->
            <div
              class="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
              :style="{
                background: `linear-gradient(135deg, ${project.gradient.from}, ${project.gradient.to})`,
              }"
            />

            <!-- Star Badge -->
            <div
              v-if="project.stars > 0"
              class="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-black/20 text-white/90 backdrop-blur-sm"
            >
              <Icon icon="lucide:star" width="12" height="12" />
              <span>{{ project.stars }}</span>
            </div>

            <!-- Language Indicator Dot -->
            <div
              v-if="project.language"
              class="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-black/20 text-white/90 backdrop-blur-sm"
            >
              <span
                class="w-2 h-2 rounded-full"
                :style="{ background: project.gradient.from }"
              />
              <span>{{ project.language }}</span>
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[500ms] ease-out">
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-xl font-bold text-white mb-1">{{ project.title }}</h3>
                <p class="text-sm text-white/70 line-clamp-2 mb-3">{{ project.description }}</p>

                <!-- Topics -->
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="topic in project.topics"
                    :key="topic"
                    class="rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/15 text-white border border-white/20"
                  >
                    {{ topic }}
                  </span>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-2">
                  <a
                    :href="project.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm transition-colors"
                    @click.stop
                  >
                    <Icon icon="simple-icons:github" class="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
