import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  function init() {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') {
      isDark.value = false
    } else if (stored === 'dark') {
      isDark.value = true
    }
    // Default: keep ref(true) — dark mode by default
    applyTheme()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, init, toggle }
})
