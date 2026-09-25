import { nextTick, onMounted, onUnmounted } from 'vue'

/**
 * Scroll-reveal for the `.reveal` / `.revealed` pattern: elements already in
 * the viewport at mount are revealed immediately (optionally staggered via
 * `--reveal-delay`), the rest are revealed by an IntersectionObserver.
 * Owns its observer and resize listener; cleans up on unmount.
 */

export interface ScrollRevealOptions {
  /** CSS selector of the elements to reveal */
  selector: string
  /** class added on reveal (omit to drive everything via onReveal) */
  classToAdd?: string
  /** also remove the class when the element leaves the viewport (lamp-style) */
  removeOnExit?: boolean
  /** IntersectionObserver threshold (default 0.1) */
  threshold?: number
  /** IntersectionObserver rootMargin */
  rootMargin?: string
  /** ms stagger between elements visible at mount; written to --reveal-delay (default 0) */
  staggerDelay?: number
  /** first-screen check uses rect.top < innerHeight * factor (default 1) */
  firstScreenFactor?: number
  /** re-run the first-screen pass on window resize */
  refitOnResize?: boolean
  /** stop observing an element after it reveals (default: keep observing) */
  once?: boolean
  /** per-element reveal callback; source is 'initial' (mount pass) or 'observer' */
  onReveal?: (el: HTMLElement, index: number, source: 'initial' | 'observer') => void
}

export function useScrollReveal(options: ScrollRevealOptions) {
  const {
    selector,
    classToAdd,
    removeOnExit = false,
    threshold = 0.1,
    rootMargin,
    staggerDelay = 0,
    firstScreenFactor = 1,
    refitOnResize = false,
    once = false,
    onReveal,
  } = options

  let observer: IntersectionObserver | null = null
  const indexByEl = new WeakMap<HTMLElement, number>()

  function reveal(el: HTMLElement, index: number, source: 'initial' | 'observer') {
    if (classToAdd) el.classList.add(classToAdd)
    onReveal?.(el, index, source)
  }

  async function run() {
    await nextTick()
    observer?.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          const index = indexByEl.get(el) ?? 0
          if (entry.isIntersecting) {
            reveal(el, index, 'observer')
            if (once) observer?.unobserve(el)
          } else if (removeOnExit && classToAdd) {
            el.classList.remove(classToAdd)
          }
        }
      },
      { threshold, rootMargin },
    )

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    elements.forEach((el, index) => indexByEl.set(el, index))

    // Toggle mode needs every element observed so classes can be removed on exit.
    if (removeOnExit) {
      elements.forEach((el) => observer?.observe(el))
      return
    }

    let firstScreenIndex = 0
    elements.forEach((el, index) => {
      if (el.getBoundingClientRect().top < window.innerHeight * firstScreenFactor) {
        if (staggerDelay > 0) {
          el.style.setProperty('--reveal-delay', `${firstScreenIndex * staggerDelay}ms`)
        }
        firstScreenIndex++
        reveal(el, index, 'initial')
      } else {
        observer?.observe(el)
      }
    })
  }

  const onResize = refitOnResize
    ? () => {
        void run()
      }
    : null

  onMounted(() => {
    void run()
    if (onResize) window.addEventListener('resize', onResize, { passive: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    if (onResize) window.removeEventListener('resize', onResize)
  })
}
