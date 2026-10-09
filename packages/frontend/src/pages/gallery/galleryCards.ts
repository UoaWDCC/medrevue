import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';
import type { CardStackCard } from '../../components/CardStack';
import type { CurrentShowCardProps } from '../../components/Cards/CurrentShowCard';
import type { Performance, Show } from '../../services/cms';

const dateFormatter = new Intl.DateTimeFormat('en-NZ', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Pacific/Auckland',
});
const timeFormatter = new Intl.DateTimeFormat('en-NZ', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Pacific/Auckland',
});

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatPerformance(performance: Performance): string | undefined {
  const start = parseDate(performance.startsAt);
  if (!start) return undefined;
  const end = parseDate(performance.endsAt);
  const doors = parseDate(performance.doorsOpenAt);
  let line = `${dateFormatter.format(start)} · ${timeFormatter.format(start)}`;
  if (end) {
    const endDate = dateFormatter.format(end);
    line += ` – ${endDate !== dateFormatter.format(start) ? `${endDate} · ` : ''}${timeFormatter.format(end)}`;
  }
  if (doors) line += ` (doors open at ${timeFormatter.format(doors)})`;
  return line;
}

function getDescription(show: Show): string {
  return show.shortDescription
    ? convertLexicalToPlaintext({
        data: show.shortDescription as unknown as SerializedEditorState,
      }).trim()
    : '';
}

export function mapCurrentShowCard(show: Show): CurrentShowCardProps {
  return {
    year: String(show.year),
    title: show.title,
    posterUrl: show.poster.url,
    posterAlt: show.poster.alt,
    description: getDescription(show),
    performanceDetails: [
      ...new Set(
        show.performances
          .map(formatPerformance)
          .filter((line): line is string => Boolean(line)),
      ),
    ],
    location: [
      ...new Set([show.venue?.trim(), show.address?.trim()].filter(Boolean)),
    ].join(', '),
  };
}

export function mapPastShowCard(show: Show): CardStackCard {
  return {
    id: show.id,
    year: String(show.year),
    title: show.title,
    description: getDescription(show),
    posterUrl: show.poster.url,
    posterAlt: show.poster.alt,
    galleryUrls: show.galleryImages.map((image) => image.url),
    galleryAlts: show.galleryImages.map((image) => image.alt),
    galleryIds: show.galleryImages.map(
      (image, index) => image.rowId ?? `${show.id}-gallery-${index}`,
    ),
  };
}
