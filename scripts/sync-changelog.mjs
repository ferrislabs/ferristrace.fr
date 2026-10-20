#!/usr/bin/env node
/**
 * Pulls CHANGELOG.md from the core repository into this one.
 *
 * The core repo is the source of truth: the entry is written in the PR that
 * makes the change. The copy kept here is the snapshot the site falls back to
 * when the build cannot reach GitHub, so the changelog page never empties out
 * because of a network failure.
 *
 * Run by .github/workflows/changelog.yml on a release, or by hand:
 *   pnpm changelog:sync
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SOURCE =
  process.env.CHANGELOG_SOURCE_URL ??
  'https://raw.githubusercontent.com/Comettrace/Cometrace/main/CHANGELOG.md'

const TARGET = fileURLToPath(new URL('../CHANGELOG.md', import.meta.url))

const response = await fetch(SOURCE, { signal: AbortSignal.timeout(15000) })

if (!response.ok) {
  console.error(`Could not read ${SOURCE}: HTTP ${response.status}`)
  console.error('The core repository may not have a CHANGELOG.md yet.')
  process.exit(1)
}

const incoming = await response.text()

if (!incoming.trim()) {
  console.error(`${SOURCE} is empty. Refusing to overwrite the snapshot with nothing.`)
  process.exit(1)
}

const current = existsSync(TARGET) ? readFileSync(TARGET, 'utf8') : null

if (current === incoming) {
  console.log('CHANGELOG.md is already up to date.')
  process.exit(0)
}

writeFileSync(TARGET, incoming)
console.log(`Updated CHANGELOG.md from ${SOURCE} (${incoming.length} bytes).`)
