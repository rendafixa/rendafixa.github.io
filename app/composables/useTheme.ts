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

/**
 * Ensures the root HTML element has the 'dark' class when the active theme is dark and removes it otherwise.
 *
 * This is a no-op outside a browser environment (when `document` is undefined).
 */
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

/**
 * Exposes reactive theme state and controls for managing light, dark, and system preferences.
 *
 * @returns An object containing:
 * - `preference` — reactive reference to the user's theme preference (`'light' | 'dark' | 'system'`)
 * - `isDark` — computed boolean indicating whether the effective theme is dark
 * - `currentTheme` — computed string with the effective theme (`'light' | 'dark'`)
 * - `setTheme` — function to update the theme preference and persist it to localStorage when available
 * - `toggleTheme` — function that toggles between light and dark themes
 * - `initTheme` — function that applies the current theme to the document
 */
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