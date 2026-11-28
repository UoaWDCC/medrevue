import type { Performance } from '../../services/cms';

const TIME_ZONE = 'Pacific/Auckland';

const dateParts = new Intl.DateTimeFormat('en-NZ', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: TIME_ZONE,
});
const timeParts = new Intl.DateTimeFormat('en-NZ', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: TIME_ZONE,
});
const monthName = new Intl.DateTimeFormat('en-NZ', {
  month: 'long',
  timeZone: 'UTC',
});
const ordinalRules = new Intl.PluralRules('en-NZ', { type: 'ordinal' });
const ordinalSuffixes: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: 'st',
  two: 'nd',
  few: 'rd',
};

type LocalDate = { year: number; month: number; day: number };

type Group = {
  times: string;
  doors?: string;
  // Days as whole numbers since 1970, so consecutive days differ by 1.
  days: Map<number, LocalDate>;
};

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getLocalDate(date: Date): LocalDate {
  const parts = dateParts.formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

// "07:30pm"
function formatTime(date: Date): string {
  const parts = timeParts.formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';
  const period = get('dayPeriod').replace(/\./g, '').toLowerCase();
  return `${get('hour')}:${get('minute')}${period}`;
}

function toDayNumber({ year, month, day }: LocalDate): number {
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

function formatOrdinal(day: number): string {
  return `${day}${ordinalSuffixes[ordinalRules.select(day)] ?? 'th'}`;
}

// Splits sorted day numbers into runs of consecutive days.
function toRuns(days: Map<number, LocalDate>): LocalDate[][] {
  const runs: LocalDate[][] = [];
  let previous = Number.NEGATIVE_INFINITY;
  for (const dayNumber of [...days.keys()].sort((a, b) => a - b)) {
    if (dayNumber !== previous + 1) runs.push([]);
    runs[runs.length - 1].push(days.get(dayNumber) as LocalDate);
    previous = dayNumber;
  }
  return runs;
}

// "13th August 2026". The month and year are left out when the next date shown
// has the same ones, e.g. the "13th" in "13th – 15th August 2026".
function formatDay(date: LocalDate, next?: LocalDate): string {
  let label = formatOrdinal(date.day);
  if (!next || next.month !== date.month || next.year !== date.year) {
    label += ` ${monthName.format(Date.UTC(2000, date.month - 1, 1))}`;
  }
  if (!next || next.year !== date.year) label += ` ${date.year}`;
  return label;
}

// "13th – 15th & 20th August 2026"
function formatDates(days: Map<number, LocalDate>): string {
  const runs = toRuns(days);
  // Each run shows its first day, plus its last day when it spans several.
  const shown = runs.flatMap((run, index) => {
    const joiner = index === 0 ? '' : index === runs.length - 1 ? ' & ' : ', ';
    const first = { date: run[0], joiner };
    return run.length === 1
      ? [first]
      : [first, { date: run[run.length - 1], joiner: ' – ' }];
  });
  return shown
    .map(
      ({ date, joiner }, index) =>
        joiner + formatDay(date, shown[index + 1]?.date),
    )
    .join('');
}

export function formatPerformanceSchedule(
  performances: Performance[],
): string[] {
  const starts = performances
    .map((performance) => ({
      performance,
      start: parseDate(performance.startsAt),
    }))
    .filter((entry): entry is typeof entry & { start: Date } => !!entry.start)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Performances with the same start, end and doors times share a group.
  const groups = new Map<string, Group>();
  for (const { performance, start } of starts) {
    const end = parseDate(performance.endsAt);
    const doors = parseDate(performance.doorsOpenAt);
    const startTime = formatTime(start);
    const endTime = end ? formatTime(end) : undefined;
    const doorsTime = doors ? formatTime(doors) : undefined;
    const key = [startTime, endTime, doorsTime].join('|');

    const group = groups.get(key) ?? {
      times: endTime ? `${startTime} – ${endTime}` : startTime,
      doors: doorsTime && `Doors open at ${doorsTime}`,
      days: new Map<number, LocalDate>(),
    };
    const date = getLocalDate(start);
    group.days.set(toDayNumber(date), date);
    groups.set(key, group);
  }

  const lines = [...groups.values()].map((group) =>
    [formatDates(group.days), group.times, group.doors].filter(
      (line): line is string => Boolean(line),
    ),
  );

  // A single schedule gets a line per detail, several get one line each.
  return lines.length === 1 ? lines[0] : lines.map((line) => line.join(' · '));
}
