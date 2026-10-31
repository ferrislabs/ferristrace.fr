import { useEffect, useState } from 'react'
import {
  applyTheme,
  cn,
  getStoredTheme,
  storeTheme,
  watchSystemTheme,
  type Theme,
} from '@ferristrace/ui'
import { Monitor, Moon, Sun } from 'lucide-react'

/** Light, then dark, then back to following the system. */
const cycle: Theme[] = ['light', 'dark', 'system']

const icons = { light: Sun, dark: Moon, system: Monitor }
const labels: Record<Theme, string> = { light: 'Light', dark: 'Dark', system: 'System' }

/**
 * The landing's own toggle, on the page's 2 px corners, for the same reason
 * `LinkButton` exists: the app's Button carries the product's radii.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // The server cannot know the stored choice, so the first paint shows the
  // default and the effect below corrects it.
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = getStoredTheme()
    setTheme(stored)
    applyTheme(stored)
    return watchSystemTheme()
  }, [])

  const next = cycle[(cycle.indexOf(theme) + 1) % cycle.length] ?? 'system'
  const Icon = icons[theme]

  function select() {
    setTheme(next)
    storeTheme(next)
  }

  return (
    <button
      type="button"
      onClick={select}
      title={`Theme: ${labels[theme]}`}
      aria-label={`Theme: ${labels[theme]}. Switch to ${labels[next].toLowerCase()}.`}
      className={cn(
        'inline-flex size-[34px] items-center justify-center rounded-[2px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
    >
      <Icon aria-hidden="true" />
    </button>
  )
}
