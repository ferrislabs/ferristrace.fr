'use client'

import * as React from 'react'
import { Icon } from '@iconify/react'
import { cn } from '../lib/utils'
import {
  applyTheme,
  getStoredTheme,
  storeTheme,
  themes,
  watchSystemTheme,
  type Theme,
} from '../lib/theme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown'

const icons: Record<Theme, string> = {
  light: 'lucide:sun',
  dark: 'lucide:moon',
  system: 'lucide:monitor',
}

const labels: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<Theme>('system')

  React.useEffect(() => {
    const stored = getStoredTheme()
    setTheme(stored)
    applyTheme(stored)
    return watchSystemTheme()
  }, [])

  const select = (next: Theme) => {
    setTheme(next)
    storeTheme(next)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
            className,
          )}
          aria-label="Toggle theme"
        >
          <Icon icon={icons[theme]} className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((option) => (
          <DropdownMenuItem key={option} onClick={() => select(option)}>
            <Icon icon={icons[option]} className="size-4" />
            {labels[option]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
