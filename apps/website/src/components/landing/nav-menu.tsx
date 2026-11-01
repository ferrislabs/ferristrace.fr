import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { ChevronDown } from 'lucide-react'
import type { CatalogEntry } from './catalog'

interface NavMenuProps {
  label: string
  /** Highlights the trigger when the current page belongs to this menu. */
  active?: boolean
  children: ReactNode
  /** Width of the panel, which is wider for the product menu. */
  className?: string
}

const CLOSE_DELAY_MS = 120

/**
 * A disclosure that opens on hover (with a short close delay, so the pointer
 * can travel from the trigger to the panel), on click and on keyboard. Escape
 * and a click outside close it. Plain links inside, no menu roles: it is
 * site navigation, not an application menu.
 */
export function NavMenu({ label, active = false, children, className }: NavMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLLIElement>(null)
  const closeTimer = useRef<number | null>(null)
  // A mouse click lands right after hover already opened the panel: toggling
  // then would close it under the pointer. Keyboard and touch still toggle.
  const lastPointer = useRef<string>('')
  const panelId = useId()

  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      rootRef.current?.querySelector('button')?.focus()
    }
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  useEffect(() => cancelClose, [])

  return (
    <li
      ref={rootRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        cancelClose()
        setOpen(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') scheduleClose()
      }}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType
        }}
        onClick={() => {
          if (lastPointer.current === 'mouse') setOpen(true)
          else setOpen((o) => !o)
          lastPointer.current = ''
        }}
        className={cn(
          'flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm transition-colors',
          open || active
            ? 'text-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          active && 'font-semibold',
        )}
      >
        {label}
        <ChevronDown
          className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          'nav-menu-panel absolute -left-2 top-full z-50 pt-3',
          className,
        )}
      >
        <div className="rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-[var(--elevation-lg)]">
          {children}
        </div>
      </div>
    </li>
  )
}

export function NavMenuGroup({ title, entries }: { title?: string; entries: CatalogEntry[] }) {
  return (
    <div>
      {title ? (
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-faint-foreground">
          {title}
        </p>
      ) : null}
      <ul>
        {entries.map(({ href, title: name, summary, Icon }) => (
          <li key={href}>
            <a
              href={href}
              className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card transition-colors group-hover:border-primary/40">
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{name}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-muted-foreground">
                  {summary}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
