import { describe, expect, it } from 'vitest';
import { formatPerformanceSchedule } from '../performanceSchedule';

// 7:30pm - 10:00pm at UTC+12 (NZST) on the given date; in NZDT months it reads an hour later.
function evening(date: string, extra = {}) {
  return {
    startsAt: `${date}T19:30:00+12:00`,
    endsAt: `${date}T22:00:00+12:00`,
    doorsOpenAt: `${date}T18:45:00+12:00`,
    ...extra,
  };
}

describe('formatPerformanceSchedule', () => {
  it('formats a consecutive run like the live site', () => {
    const lines = formatPerformanceSchedule([
      evening('2026-08-13'),
      evening('2026-08-14'),
      evening('2026-08-15'),
    ]);

    expect(lines).toEqual([
      '13th – 15th August 2026',
      '07:30pm – 10:00pm',
      'Doors open at 06:45pm',
    ]);
  });

  it('handles non-consecutive dates and month boundaries', () => {
    const first = (dates: string[]) =>
      formatPerformanceSchedule(dates.map((date) => evening(date)))[0];

    expect(
      first(['2026-08-13', '2026-08-14', '2026-08-15', '2026-08-20']),
    ).toBe('13th – 15th & 20th August 2026');
    expect(first(['2026-08-13', '2026-08-15', '2026-08-20'])).toBe(
      '13th, 15th & 20th August 2026',
    );
    expect(first(['2026-08-30', '2026-08-31', '2026-09-01'])).toBe(
      '30th August – 1st September 2026',
    );
    expect(first(['2026-12-31', '2027-01-01'])).toBe(
      '31st December 2026 – 1st January 2027',
    );
  });

  it('puts each schedule group on one line', () => {
    const matinee = {
      startsAt: '2026-08-15T14:00:00+12:00',
      endsAt: '2026-08-15T16:30:00+12:00',
      doorsOpenAt: '2026-08-15T13:30:00+12:00',
    };

    expect(
      formatPerformanceSchedule([
        evening('2026-08-13'),
        evening('2026-08-14'),
        matinee,
      ]),
    ).toEqual([
      '13th – 14th August 2026 · 07:30pm – 10:00pm · Doors open at 06:45pm',
      '15th August 2026 · 02:00pm – 04:30pm · Doors open at 01:30pm',
    ]);
  });

  it('leaves out missing end and doors times', () => {
    expect(
      formatPerformanceSchedule([{ startsAt: '2026-08-13T19:30:00+12:00' }]),
    ).toEqual(['13th August 2026', '07:30pm']);
  });

  it('uses the Auckland date for a UTC timestamp', () => {
    // 19:30 UTC on the 12th is 07:30am on the 13th in Auckland.
    expect(
      formatPerformanceSchedule([{ startsAt: '2026-08-12T19:30:00Z' }]),
    ).toEqual(['13th August 2026', '07:30am']);
  });
});
