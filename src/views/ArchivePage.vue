<script setup lang="ts">
interface Article {
  title: string
  date: string
  readingTime: string
  slug: string
  excerpt: string
}

const articles: Article[] = [
  {
    title: '事件循环',
    date: '2026-05-23',
    readingTime: '阅读 14 分钟',
    slug: '/posts/cmphvj824000004lb7u9p9wsq',
    excerpt: '面试率 90% 的JS事件循环Event Loop，看这篇就够了！',
  },
]

const stats = {
  totalArticles: 1,
  totalCategories: 0,
  blogPostings: 1,
  totalWordCount: '4.7k',
}

const yearGroups = [
  {
    year: '2026',
    months: [{ month: '2026-05', count: 1 }],
  },
]
</script>

<template>
  <div class="relative z-10">
    <div class="mx-auto max-w-4xl px-4 py-16">
      <h1 class="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-8">归档</h1>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div class="rounded-xl border border-border-default bg-bg-primary p-4 dark:border-border-dark dark:bg-bg-dark-primary">
          <p class="text-2xl font-bold font-mono text-text-primary dark:text-text-dark-primary">{{ stats.totalArticles }}</p>
          <p class="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-1">Total Articles</p>
        </div>
        <div class="rounded-xl border border-border-default bg-bg-primary p-4 dark:border-border-dark dark:bg-bg-dark-primary">
          <p class="text-2xl font-bold font-mono text-text-primary dark:text-text-dark-primary">{{ stats.totalCategories }}</p>
          <p class="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-1">Total Categories</p>
        </div>
        <div class="rounded-xl border border-border-default bg-bg-primary p-4 dark:border-border-dark dark:bg-bg-dark-primary">
          <p class="text-2xl font-bold font-mono text-text-primary dark:text-text-dark-primary">{{ stats.blogPostings }}</p>
          <p class="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-1">Blog Postings</p>
        </div>
        <div class="rounded-xl border border-border-default bg-bg-primary p-4 dark:border-border-dark dark:bg-bg-dark-primary">
          <p class="text-2xl font-bold font-mono text-text-primary dark:text-text-dark-primary">{{ stats.totalWordCount }}</p>
          <p class="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-1">Total Word Count</p>
        </div>
      </div>

      <!-- Timeline -->
      <h3 class="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">归档时间轴</h3>

      <div class="space-y-8">
        <div v-for="yearGroup in yearGroups" :key="yearGroup.year">
          <h2 class="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-4">{{ yearGroup.year }}</h2>
          <div v-for="month in yearGroup.months" :key="month.month" class="mb-4">
            <h3 class="text-sm font-mono text-text-tertiary dark:text-text-dark-tertiary mb-3">{{ month.month }}</h3>
            <div class="space-y-3">
              <article
                v-for="article in articles"
                :key="article.slug"
                class="rounded-xl border border-border-default bg-bg-primary p-5 dark:border-border-dark dark:bg-bg-dark-primary transition-all duration-300 hover:border-border-hover dark:hover:border-border-dark-hover hover:shadow-sm"
              >
                <div class="flex items-center gap-2 text-xs text-text-tertiary dark:text-text-dark-tertiary font-mono mb-2">
                  <span>{{ article.date }}</span>
                  <span>{{ article.readingTime }}</span>
                </div>
                <h4 class="font-mono text-lg font-bold text-text-primary dark:text-text-dark-primary">{{ article.title }}</h4>
                <p class="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">{{ article.excerpt }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
