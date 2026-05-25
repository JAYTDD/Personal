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
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">归档</h1>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ stats.totalArticles }}</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Total Articles</p>
        </div>
        <div class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ stats.totalCategories }}</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Total Categories</p>
        </div>
        <div class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ stats.blogPostings }}</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Blog Postings</p>
        </div>
        <div class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ stats.totalWordCount }}</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Total Word Count</p>
        </div>
      </div>

      <!-- Timeline -->
      <h3 class="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">归档时间轴</h3>

      <div class="space-y-8">
        <div v-for="yearGroup in yearGroups" :key="yearGroup.year">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{{ yearGroup.year }}</h2>
          <div v-for="month in yearGroup.months" :key="month.month" class="mb-4">
            <h3 class="text-sm font-mono text-zinc-500 dark:text-zinc-400 mb-3">{{ month.month }}</h3>
            <div class="space-y-3">
              <article
                v-for="article in articles"
                :key="article.slug"
                class="border-3 border-zinc-900 bg-white p-5 dark:border-zinc-200 dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)] transition-shadow duration-200 cursor-pointer"
              >
                <div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-2">
                  <span>{{ article.date }}</span>
                  <span>{{ article.readingTime }}</span>
                </div>
                <h4 class="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">{{ article.title }}</h4>
                <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{{ article.excerpt }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
