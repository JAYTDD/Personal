/** 项目展示辅助 —— 语言色渐变（首页 ProjectCard 顶栏） */

const LANGUAGE_GRADIENTS: Record<string, { from: string; to: string }> = {
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
