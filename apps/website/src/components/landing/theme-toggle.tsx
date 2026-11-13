import { useEffect, useState } from 'react'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
  storeTheme,
  watchSystemTheme,
} from '@cometrace/ui'
import { Moon, Sun } from 'lucide-react'

type Appearance = 'light' | 'dark'

/** What the page shows right now, whether it comes from a choice or from the system. */
function currentAppearance(): Appearance {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Flips what is on screen. A light -> dark -> system cycle looked broken:
 * under a light system, the first click (system -> light) changed nothing.
 * Until the first click the page follows the system; after it, the choice
 * sticks in the theme cookie.
 */
function useAppearance() {
  // The server cannot know the cookie or the system preference: the first
  // paint assumes light and the effect corrects it.
  const [appearance, setAppearance] = useState<Appearance>('light')

  useEffect(() => {
    setAppearance(currentAppearance())
    const stopWatching = watchSystemTheme()
    // The system can flip while the choice is still "system", and the inline
    // script in base.astro re-applies the cookie after each page swap.
    const sync = () => setAppearance(currentAppearance())
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => {
      stopWatching()
      observer.disconnect()
    }
  }, [])

  const next: Appearance = appearance === 'dark' ? 'light' : 'dark'
  const toggle = () => {
    storeTheme(next)
    setAppearance(next)
  }

  return { appearance, next, toggle }
}

const labels: Record<Appearance, string> = { light: 'light', dark: 'dark' }

export function ThemeToggle({ className }: { className?: string }) {
  const { appearance, next, toggle } = useAppearance()
  const Icon = appearance === 'dark' ? Moon : Sun

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggle}
          aria-label={`Switch to ${labels[next]} mode`}
          className={cn('w-9 px-0', className)}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Switch to {labels[next]} mode</TooltipContent>
    </Tooltip>
  )
}

/** The same switch as a full-width row, for the mobile menu. */
export function ThemeRow() {
  const { appearance, next, toggle } = useAppearance()
  const Icon = appearance === 'dark' ? Moon : Sun

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center justify-between border-b border-border px-5 py-3 text-sm font-semibold hover:bg-foreground/[0.04]"
    >
      Theme
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        <span className="font-normal">Switch to {labels[next]}</span>
      </span>
    </button>
  )
}
