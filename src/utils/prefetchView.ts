/**
 * Intent-based view chunk prefetch — hover/focus on nav links, not idle-all.
 * Dedupes so each route import() runs at most once per session.
 */

const cache = new Set<string>()

const loaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('@/views/HomePage.vue'),
  '/resume': () => import('@/views/ResumePage.vue'),
  '/experience': () => import('@/views/ExperiencePage.vue'),
  '/about': () => import('@/views/AboutPage.vue'),
}

export function prefetchView(path: string) {
  const normalized = path.split('?')[0]?.split('#')[0] || path
  if (cache.has(normalized)) return
  const load = loaders[normalized]
  if (!load) return
  cache.add(normalized)
  void load()
}

/** Prefetch nav neighbors of current path (idle, light). */
export function prefetchAdjacent(currentPath: string, order: string[]) {
  const idx = order.indexOf(currentPath)
  if (idx === -1) return
  if (idx > 0) prefetchView(order[idx - 1]!)
  if (idx < order.length - 1) prefetchView(order[idx + 1]!)
}
