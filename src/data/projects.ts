import type { GithubRepo } from '@/composables/useGithubRepos'

/**
 * 项目展示硬数据 —— 不再调 GitHub API。
 *
 * 想加/删/改项目直接编辑这个数组；字段结构与 GitHub REST
 * `GET /users/{user}/repos` 响应一致，将来想换回 API 时
 * 可以直接对接，无需改消费方。
 *
 * 日期格式：ISO 8601 字符串（任意过去时间即可，只用来排序）。
 */
export const STATIC_PROJECTS: GithubRepo[] = [
  {
    name: 'personal-site',
    description: '我的个人博客站点（Vue 3 + Vite + Tailwind 4）',
    html_url: 'https://github.com/JAYTDD/personal-site',
    language: 'Vue',
    stargazers_count: 0,
    topics: ['vue', 'typescript', 'vite', 'tailwindcss'],
    updated_at: '2026-06-22T00:00:00Z',
    fork: false,
  },
  {
    name: 'lunesnow-Intelligent-BI',
    description: '智能 BI 数据分析平台',
    html_url: 'https://github.com/JAYTDD/lunesnow-Intelligent-BI',
    language: 'TypeScript',
    stargazers_count: 0,
    topics: ['bi', 'data-analysis', 'typescript'],
    updated_at: '2026-05-10T00:00:00Z',
    fork: false,
  },
]
