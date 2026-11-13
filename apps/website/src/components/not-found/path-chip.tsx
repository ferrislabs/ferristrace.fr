import { truncateMiddle } from '../../lib/suggest'

/**
 * The site is statically built, so the requested path is only knowable in the
 * browser. Until it is, the chip shows the status on its own rather than an
 * empty "GET".
 */
export function PathChip({ path }: { path: string | null }) {
  return (
    <p className="inline-flex max-w-full items-center gap-2 self-center border border-border bg-card px-3 py-1.5 font-pixel text-[10px] uppercase tracking-[0.08em]">
      <span className="font-semibold text-muted-foreground">HTTP 404</span>
      {path ? (
        <>
          <span aria-hidden="true" className="text-faint-foreground">
            ·
          </span>
          <span className="truncate text-muted-foreground" title={path}>
            GET {truncateMiddle(path)}
          </span>
        </>
      ) : null}
    </p>
  )
}
