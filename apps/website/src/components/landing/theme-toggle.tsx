import { useEffect, useState } from 'react'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  applyTheme,
  cn,
  getStoredTheme,
  storeTheme,
  watchSystemTheme,
  type Theme,
} from '@explainer/ui'
import { Monitor, Moon, Sun } from 'lucide-react'

/** Light, then dark, then back to following the system. */
const cycle: Theme[] = ['light', 'dark', 'system']

const icons = { light: Sun, dark: Moon, system: Monitor }
const labels: Record<Theme, string> = { light: 'Light', dark: 'Dark', system: 'System' }

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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={select}
          aria-label={`Theme: ${labels[theme]}. Switch to ${labels[next].toLowerCase()}.`}
          className={cn('w-9 px-0', className)}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Theme: {labels[theme]}</TooltipContent>
    </Tooltip>
  )
}
