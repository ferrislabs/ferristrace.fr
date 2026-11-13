import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { ChevronDown } from 'lucide-react'
import { PixelSprite } from '../pixel/pixel-sprite'
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
      className="relative flex"
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
          'flex cursor-pointer items-center gap-1.5 border-r border-border px-4 text-[13px] font-medium transition-colors',
          open
            ? 'bg-foreground/[0.04] text-foreground'
            : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground',
          active && 'text-foreground shadow-[inset_0_-2px_0_var(--primary)]',
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
        className={cn('nav-menu-panel absolute left-0 top-full z-50', className)}
      >
        <div className="border border-t-2 border-border border-t-primary bg-popover text-popover-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,0.45)]">
          {children}
        </div>
      </div>
    </li>
  )
}

export function NavMenuGroup({
  title,
  entries,
  className,
}: {
  title?: string
  entries: CatalogEntry[]
  className?: string
}) {
  return (
    <div className={className}>
      {title ? (
        <p className="px-4 pb-1 pt-4 font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
          {title}
        </p>
      ) : null}
      <ul>
        {entries.map(({ href, title: name, summary, sprite }) => (
          <li key={href}>
            <a
              href={href}
              className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-foreground/[0.04]"
            >
              <PixelSprite
                sprite={sprite}
                className="mt-0.5 block size-7 shrink-0 transition-transform group-hover:-translate-y-0.5"
              />
              <span className="min-w-0">
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
