import { cn } from '@cometrace/ui'

/**
 * lucide-react v1 dropped its brand icons, so the GitHub mark is inlined here
 * on the same 24x24 grid as the lucide icons used elsewhere on the page.
 */
export function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('size-4', className)}
    >
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.78c-2.92.63-3.54-1.4-3.54-1.4-.48-1.21-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.08 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.08a10.1 10.1 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.45.21 2.52.1 2.79.67.74 1.08 1.68 1.08 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  )
}
