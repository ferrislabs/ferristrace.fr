import { cn } from '@explainer/ui'

/**
 * The Cometrace mark: a head and three trailing strokes, on the same 24x24
 * grid as the lucide icons. The stroke is lighter than lucide's 2 because the
 * mark renders at 20 px next to 16 px icons, which evens out the two weights.
 */
export function CometMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('size-5', className)}
    >
      <circle cx="15.25" cy="8.75" r="4.25" />
      <path d="M11.3 12.7 3.5 20.5" />
      <path d="M7.6 10.4 4.6 13.4" />
      <path d="M13.6 16.4 10.6 19.4" />
    </svg>
  )
}
