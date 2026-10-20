/**
 * Parser for a Keep a Changelog 1.1 file, plus the two conventions Cometrace
 * adds on top of it:
 *
 *   - the first "> " line after a version heading is the release title, and a
 *     second "> " line is its one-sentence summary;
 *   - a bullet starting with "**Breaking:**" leaves its section and becomes a
 *     breaking change on the release.
 *
 * Nothing here invents content: a release without a title or summary simply
 * has none, and the page falls back rather than filling the gap.
 */

export const GROUP_TYPES = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security',
] as const

export type GroupType = (typeof GROUP_TYPES)[number]

export interface ReleaseGroup {
  type: GroupType
  items: string[]
}

export interface Release {
  version: string
  /** ISO date, as written in the heading. */
  date: string
  title?: string
  summary?: string
  breaking: string[]
  groups: ReleaseGroup[]
}

/** "## [0.9.0] - 2026-10-14", also tolerating a bare "## 0.9.0 - 2026-10-14". */
const VERSION_HEADING = /^##\s+\[?([^\]\s]+)\]?\s*-\s*(\d{4}-\d{2}-\d{2})\s*$/
const SECTION_HEADING = /^###\s+(.+?)\s*$/
const BULLET = /^[-*]\s+(.+)$/
const QUOTE = /^>\s?(.*)$/
const BREAKING = /^\*\*Breaking:\*\*\s*/

const isGroupType = (value: string): value is GroupType =>
  (GROUP_TYPES as readonly string[]).includes(value)

export function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = []

  let release: Release | null = null
  let section: GroupType | null = null
  // Set while inside "## [Unreleased]", which is skipped entirely.
  let skipping = false

  const groupFor = (type: GroupType, target: Release): ReleaseGroup => {
    const existing = target.groups.find((group) => group.type === type)
    if (existing) return existing

    const created: ReleaseGroup = { type, items: [] }
    target.groups.push(created)
    return created
  }

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim()

    const heading = VERSION_HEADING.exec(line)
    if (heading) {
      release = { version: heading[1], date: heading[2], breaking: [], groups: [] }
      releases.push(release)
      section = null
      skipping = false
      continue
    }

    // Any other "## " heading ends the current release. That covers
    // "## [Unreleased]" and the link-reference footer some files carry.
    if (line.startsWith('## ')) {
      release = null
      section = null
      skipping = true
      continue
    }

    if (skipping || !release) continue

    const sectionHeading = SECTION_HEADING.exec(line)
    if (sectionHeading) {
      const name = sectionHeading[1]
      section = isGroupType(name) ? name : null
      continue
    }

    // Title and summary, in that order, before any section.
    const quote = QUOTE.exec(line)
    if (quote && !section) {
      const text = quote[1].trim()
      if (!text) continue
      if (release.title === undefined) release.title = text
      else if (release.summary === undefined) release.summary = text
      continue
    }

    const bullet = BULLET.exec(line)
    if (!bullet) continue

    const text = bullet[1].trim()
    if (BREAKING.test(text)) {
      release.breaking.push(text.replace(BREAKING, '').trim())
      continue
    }

    if (section) groupFor(section, release).items.push(text)
  }

  // Keep a Changelog order, and drop sections that ended up empty.
  for (const entry of releases) {
    entry.groups = entry.groups
      .filter((group) => group.items.length > 0)
      .sort((a, b) => GROUP_TYPES.indexOf(a.type) - GROUP_TYPES.indexOf(b.type))
  }

  return releases
}

/** "2026-10-14" -> "October 14, 2026". Stable regardless of server locale. */
export function formatReleaseDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/** "0.9.0" -> "v0-9-0", the anchor id used by /changelog#v0-9-0. */
export function releaseAnchor(version: string): string {
  return `v${version.replace(/\./g, '-')}`
}
