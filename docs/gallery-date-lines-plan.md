# Gallery Date Lines Plan

## Problem

The current show card on the Gallery page prints one line per performance:

```text
13 August 2026 · 7:30 pm – 10:00 pm (doors open at 6:45 pm)
14 August 2026 · 7:30 pm – 10:00 pm (doors open at 6:45 pm)
15 August 2026 · 7:30 pm – 10:00 pm (doors open at 6:45 pm)
```

The live site (before the CMS) shows the same information as:

```text
13th – 15th August 2026
07:30pm – 10:00pm
Doors open at 06:45pm
```

## Goal

Build the date lines from the CMS `performances` array so a typical run reads
exactly like the live site, and less regular schedules still read cleanly.

## Approach

Replace `formatPerformance` in `packages/frontend/src/pages/gallery/galleryCards.ts`
with a `formatPerformanceSchedule(performances): string[]` function, kept in a
small module next to it (`performanceSchedule.ts`). `mapCurrentShowCard` passes
its result to `performanceDetails`; `CurrentShowCard` needs no changes.

All dates and times are read in `Pacific/Auckland`, as they are today.

### 1. Normalise

For each performance with a valid `startsAt`, take its local:

- calendar date (from `startsAt`)
- start time
- end time (if `endsAt` is set)
- doors time (if `doorsOpenAt` is set)

Sort by `startsAt`. Drop exact duplicates.

### 2. Group by schedule

Group performances whose start, end, and doors times are all identical. Groups
keep the order of their earliest performance.

### 3. Collapse dates within a group

Split each group's dates into runs of consecutive calendar days, then format:

| Dates                  | Output                                   |
| ---------------------- | ---------------------------------------- |
| 13 Aug                 | `13th August 2026`                       |
| 13–15 Aug              | `13th – 15th August 2026`                |
| 13, 15 Aug             | `13th & 15th August 2026`                |
| 13–15, 20 Aug          | `13th – 15th & 20th August 2026`         |
| 13, 15, 20 Aug         | `13th, 15th & 20th August 2026`          |
| 30 Aug – 1 Sep         | `30th August – 1st September 2026`       |
| 31 Dec 2026 – 1 Jan 27 | `31st December 2026 – 1st January 2027`  |

Months and years are only repeated when they change. Ordinals come from
`Intl.PluralRules('en-NZ', { type: 'ordinal' })`.

### 4. Format times like the live site

- Times: `07:30pm` (two-digit hour, lowercase am/pm, no space), via
  `Intl.DateTimeFormat` `formatToParts` so it stays timezone-correct.
- Time line: `07:30pm – 10:00pm`, or just `07:30pm` with no end time.
- Doors line: `Doors open at 06:45pm`, left out with no doors time.
- An end time after midnight is shown as a time only (no extra date).

### 5. Emit lines

- **One schedule group** (the normal case): three lines, matching the live site:

  ```text
  13th – 15th August 2026
  07:30pm – 10:00pm
  Doors open at 06:45pm
  ```

- **Several groups** (e.g. an added matinee): one line per group, so the card
  stays short:

  ```text
  13th – 15th August 2026 · 07:30pm – 10:00pm · Doors open at 06:45pm
  15th August 2026 · 02:00pm – 04:30pm · Doors open at 01:30pm
  ```

- **No valid performances**: no lines (the card already hides the box, apart
  from the location line).

The location line (`venue, address`) is unchanged.

## Tests

One focused unit test file for `formatPerformanceSchedule`, covering the cases
that are easy to break:

- the real 2026 run → the three live-site lines
- non-consecutive dates and a month boundary
- two schedule groups → one line each
- missing `endsAt` / `doorsOpenAt`
- a UTC timestamp that falls on the next day in Auckland

Remove the old per-performance expectations if any existing gallery test relies
on them.

## Out of Scope

- Past show cards (they don't show dates).
- Changing CMS fields or the `CurrentShowCard` layout.
- Ticket prices, which the live site showed on the old 2025 show page but the
  CMS has no field for.
