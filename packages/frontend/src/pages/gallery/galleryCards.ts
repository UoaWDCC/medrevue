import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext';
import type { CardStackCard } from '../../components/CardStack';
import type { CurrentShowCardProps } from '../../components/Cards/CurrentShowCard';
import type { Show } from '../../services/cms';
import { formatPerformanceSchedule } from './performanceSchedule';

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
    performanceDetails: formatPerformanceSchedule(show.performances),
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
    galleryThumbnailUrls: show.galleryImages.map((image) => image.thumbnailUrl),
    galleryAlts: show.galleryImages.map((image) => image.alt),
    galleryIds: show.galleryImages.map(
      (image, index) => image.rowId ?? `${show.id}-gallery-${index}`,
    ),
  };
}
