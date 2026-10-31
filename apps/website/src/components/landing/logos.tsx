import { Band, Column } from './frame'

interface User {
  name: string
  /**
   * The square mark alone, never the lockup: the name is set in text beside
   * it, so a lockup would print it twice. A single-colour mark has to be the
   * variant that survives both themes — a black or white one vanishes on one
   * of the two grounds.
   */
  src: string
  /** Left out until the address is known: the entry then shows unlinked
   *  rather than sending a visitor somewhere that does not answer. */
  href?: string
}

/** A real mark goes here only with the company's permission. */
const users: User[] = [
  { name: 'Wakfuli', src: '/sponsors/wakfuli.svg' },
  { name: 'Nebulabs', src: '/sponsors/nebulabs.svg' },
]

export function Logos() {
  return (
    <Band tint>
      <Column className="flex min-h-[104px] flex-wrap items-center gap-x-10 gap-y-4 py-6">
        <p className="text-sm text-faint-foreground">Used by</p>
        {users.map((user) => {
          const mark = (
            <>
              {/* The mark carries its own colour, so it is not recoloured. */}
              <img src={user.src} alt="" aria-hidden="true" className="h-7 w-auto" />
              <span className="text-[16px] font-semibold">{user.name}</span>
            </>
          )

          return user.href ? (
            <a
              key={user.name}
              href={user.href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2.5 rounded-[2px] transition-opacity hover:opacity-70"
            >
              {mark}
            </a>
          ) : (
            <p key={user.name} className="flex items-center gap-2.5">
              {mark}
            </p>
          )
        })}
      </Column>
    </Band>
  )
}
