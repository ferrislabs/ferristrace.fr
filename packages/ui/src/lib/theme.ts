import { getCookie, setCookie } from './cookies'

export type Theme = 'light' | 'dark' | 'system'

export const themes: readonly Theme[] = ['light', 'dark', 'system']

export function isDarkTheme(theme: Theme): boolean {
  return (
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}

/**
 * Writes both classes. A stylesheet that falls back to prefers-color-scheme
 * needs `.light` to be explicit, otherwise picking Light under a dark system
 * preference would leave the dark palette in place.
 */
export function applyTheme(theme: Theme) {
  const dark = isDarkTheme(theme)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.classList.toggle('light', !dark)
}

export function getStoredTheme(): Theme {
  const stored = getCookie('theme')
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

export function storeTheme(theme: Theme) {
  setCookie('theme', theme)
  applyTheme(theme)
}

/** Keeps the document in sync with the OS while the choice stays on "system". */
export function watchSystemTheme(): () => void {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (getStoredTheme() === 'system') applyTheme('system')
  }

  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
