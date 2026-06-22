import { ref, onMounted, type Ref } from 'vue'

export interface GithubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  topics: string[]
  updated_at: string
  fork: boolean
}

export const LANGUAGE_GRADIENTS: Record<string, { from: string; to: string }> = {
  TypeScript: { from: '#3178C6', to: '#235A97' },
  Vue: { from: '#4FC08D', to: '#3BA776' },
  JavaScript: { from: '#F7DF1E', to: '#D4B812' },
  HTML: { from: '#E34F26', to: '#C43E1D' },
  CSS: { from: '#1572B6', to: '#0F5A8C' },
  Python: { from: '#3776AB', to: '#2A5F8F' },
  Java: { from: '#B07219', to: '#8E5B14' },
  Go: { from: '#00ADD8', to: '#0091B5' },
  Rust: { from: '#DEA584', to: '#C4866E' },
}

const DEFAULT_GRADIENT = { from: '#6B7280', to: '#4B5563' }

export function getLanguageGradient(language: string | null) {
  return LANGUAGE_GRADIENTS[language ?? ''] ?? DEFAULT_GRADIENT
}

export function formatRepoName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

interface UseGithubReposOptions {
  username?: string
  autoFetch?: boolean
}

export function useGithubRepos(options: UseGithubReposOptions = {}) {
  const { username = 'JAYTDD', autoFetch = true } = options

  const repos: Ref<GithubRepo[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRepos = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(
        `/api/github/repos?user=${encodeURIComponent(username)}&per_page=30&sort=updated`,
        { headers: { Accept: 'application/vnd.github+json' } }
      )

      if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
          throw new Error('API 频率限制，请稍后再试')
        }
        throw new Error(`请求失败 (${res.status})`)
      }

      const data: GithubRepo[] = await res.json()

      repos.value = data
        .filter((r) => !r.fork)
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取项目失败'
    } finally {
      loading.value = false
    }
  }

  if (autoFetch) {
    onMounted(fetchRepos)
  }

  return { repos, loading, error, fetchRepos }
}
