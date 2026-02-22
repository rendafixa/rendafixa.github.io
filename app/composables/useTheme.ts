import { ref, computed, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const THEME_KEY = 'rendafixa-theme'

const preference = ref<Theme>('system')
const systemIsDark = ref(false)

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    preference.value = stored
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemIsDark.value = mediaQuery.matches
  mediaQuery.addEventListener('change', (e) => {
    systemIsDark.value = e.matches
  })
}

const isDark = computed(() => {
  if (preference.value === 'system') {
    return systemIsDark.value
  }
  return preference.value === 'dark'
})

function applyTheme() {
  if (typeof document === 'undefined')
    return

  const html = document.documentElement
  const shouldBeDark = isDark.value

  if (shouldBeDark) {
    html.classList.add('dark')
  }
  else {
    html.classList.remove('dark')
  }
}

watch(isDark, applyTheme)

export function useTheme() {
  const currentTheme = computed(() => {
    if (preference.value === 'system') {
      return systemIsDark.value ? 'dark' : 'light'
    }
    return preference.value
  })

  function setTheme(theme: Theme) {
    preference.value = theme
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, theme)
    }
  }

  function toggleTheme() {
    const nextTheme = isDark.value ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  function initTheme() {
    applyTheme()
  }

  return {
    preference,
    isDark,
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
