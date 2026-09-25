import { onUnmounted, ref } from 'vue'

/**
 * Sequential typewriter for one or more lines.
 *
 * Owns every typing timer and disposes them on unmount. With
 * prefers-reduced-motion, all lines are filled instantly instead.
 */

type TimerHandle = ReturnType<typeof setInterval> | ReturnType<typeof setTimeout>

export interface UseTypewriterOptions {
  /** ms per character (default 80) */
  speed?: number
  /** ms pause between consecutive lines (default 400) */
  lineDelay?: number
  /** ms before the first line starts (default 0) */
  startDelay?: number
  /** called once after the last line finishes (not called in reduced-motion skip) */
  onAllDone?: () => void
}

export function useTypewriter(lineTexts: readonly string[], options: UseTypewriterOptions = {}) {
  const { speed = 80, lineDelay = 400, startDelay = 0, onAllDone } = options

  const lines = ref<string[]>(lineTexts.map(() => ''))
  /** index of the line currently being typed; === lineTexts.length when all done */
  const activeLineIndex = ref(0)
  const done = ref(false)

  const timers = new Set<TimerHandle>()
  let disposed = false

  function dispose() {
    disposed = true
    timers.forEach((timer) => {
      clearInterval(timer)
      clearTimeout(timer)
    })
    timers.clear()
  }

  function typeLine(lineIndex: number) {
    const text = lineTexts[lineIndex]
    if (disposed || text === undefined) return

    let charIndex = 0
    const timer = setInterval(() => {
      if (disposed) {
        clearInterval(timer)
        timers.delete(timer)
        return
      }
      if (charIndex < text.length) {
        lines.value[lineIndex] += text.charAt(charIndex)
        charIndex++
        return
      }
      clearInterval(timer)
      timers.delete(timer)
      activeLineIndex.value = lineIndex + 1
      if (activeLineIndex.value < lineTexts.length) {
        timers.add(setTimeout(() => typeLine(lineIndex + 1), lineDelay))
      } else {
        done.value = true
        onAllDone?.()
      }
    }, speed)
    timers.add(timer)
  }

  function start() {
    if (disposed) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lines.value = [...lineTexts]
      activeLineIndex.value = lineTexts.length
      done.value = true
      return
    }
    timers.add(setTimeout(() => typeLine(0), startDelay))
  }

  onUnmounted(dispose)

  return { lines, activeLineIndex, done, start, dispose }
}
