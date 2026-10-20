# Changelog — EXAMPLE FILE

This file is **an example**, not the Cometrace changelog. It exists so the
parser has a fixture to be tested against and so `/changelog` has something to
render before the real `CHANGELOG.md` lands at the repository root. The
releases below are made up. Never publish it as the real changelog.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 1.1, plus two
Cometrace conventions:

- the first `>` line under a version heading is the release title, a second one
  is the summary;
- a bullet starting with `**Breaking:**` is pulled out into the breaking
  callout, whichever section it sits in.

## [Unreleased]

### Added

- Entries land here until they ship. The page ignores this section.

## [0.9.0] - 2026-10-14

> Span links and a faster waterfall
> The trace view now renders links between spans, and large traces open without the stall.

### Added

- Span links, rendered in the side panel under `LINKS` with the linked trace id.
- `OTEL_EXPORTER_OTLP_HEADERS` is read on the Collector receiver as well.

### Changed

- The waterfall virtualises rows past 500 spans, so a 10k span trace opens in one frame.
- **Breaking:** `cmt_key_` ingest keys are rejected. Reissue them as `cmt_ik_` from the workspace settings.

### Fixed

- A log record whose trace id was all zeroes no longer links to an empty trace.

### Security

- Api tokens are hashed with Argon2id instead of bcrypt. Existing tokens keep working.

## [0.8.2] - 2026-09-30

> Retention fixes

### Fixed

- Retention ran against the wrong project when a workspace had more than one.
- The setup token printed at first boot was truncated to 32 characters.
