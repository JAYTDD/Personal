import { onUnmounted, ref } from 'vue'

/**
 * Cycles through a list of words on a fixed interval (Word Rotate).
 * Cheap single interval; the consumer renders the swap with a <Transition>.
 */
export function useWordRotate(words: readonly string[], { interval = 4500 } = {}) {
  const index = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  function start(from = 0) {
    stop()
    if (words.length <= 1) return
    index.value = from
    timer = setInterval(() => {
      index.value = (index.value + 1) % words.length
    }, interval)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onUnmounted(stop)

  return { index, start, stop }
}
