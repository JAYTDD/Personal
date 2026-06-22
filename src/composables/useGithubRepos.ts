import { ref, type Ref } from 'vue'
import { STATIC_PROJECTS } from '@/data/projects'

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
  /** Reserved for future use; data source is currently hardcoded. */
  username?: string
  /** Reserved for future use; no fetch happens in static mode. */
  autoFetch?: boolean
}

/**
 * Returns the project's static repo list. The composable shape is kept
 * (loading / error / fetchRepos) for backward compatibility with the
 * consumer in HomePage.vue, but no network calls are made.
 *
 * To add or change projects, edit `src/data/projects.ts`.
 */
export function useGithubRepos(_options: UseGithubReposOptions = {}) {
  const repos: Ref<GithubRepo[]> = ref<GithubRepo[]>(
    [...STATIC_PROJECTS].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    ),
  )
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRepos = async () => {
    // No-op: data is hardcoded. Kept so consumer can call it without changes.
  }

  return { repos, loading, error, fetchRepos }
}
