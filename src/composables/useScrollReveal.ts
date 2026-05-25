import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollReveal(
  targetRef: Ref<HTMLElement | null>,
  options?: {
    threshold?: number
    rootMargin?: string
    initialClass?: string
    visibleClass?: string
  },
) {
  const isVisible = ref(false)
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
  } = options || {}

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          isVisible.value = true
          observer?.unobserve(entry.target)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { isVisible }
}
