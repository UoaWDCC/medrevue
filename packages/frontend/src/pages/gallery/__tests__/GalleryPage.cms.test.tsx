import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Show } from '../../../services/cms';
import GalleryPage from '../GalleryPage';

const { useGetCurrentShowQueryMock, useGetShowsQueryMock } = vi.hoisted(() => ({
  useGetCurrentShowQueryMock: vi.fn(),
  useGetShowsQueryMock: vi.fn(),
}));

vi.mock('../../../services/cms', () => ({
  useGetCurrentShowQuery: useGetCurrentShowQueryMock,
  useGetShowsQuery: useGetShowsQueryMock,
}));

vi.mock('../../../components/Cards/CurrentShowCard', () => ({
  default: ({
    title,
    description,
    posterUrl,
  }: {
    title: string;
    description: string;
    posterUrl?: string;
  }) => (
    <section aria-label="Current show">
      <h2>{title}</h2>
      <p>{description}</p>
      {posterUrl && <img src={posterUrl} alt="Current show poster" />}
    </section>
  ),
}));

vi.mock('../../../components/CardStack', () => ({
  default: ({
    cards = [],
  }: {
    cards?: Array<{
      id?: string;
      title: string;
      description: string;
      galleryUrls: string[];
    }>;
  }) => (
    <section aria-label="Past shows">
      {cards.map((card) => (
        <article key={card.id ?? card.title}>
          <h2>{card.title}</h2>
          <p>{card.description}</p>
          {card.galleryUrls.map((url) => (
            <img key={url} src={url} alt={`${card.title} gallery`} />
          ))}
        </article>
      ))}
    </section>
  ),
}));

function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  };
}

function show(id: string, year: number, title: string): Show {
  return {
    id,
    year,
    title,
    poster: {
      id: `${id}-poster`,
      url: `http://localhost:3001/api/media/file/${id}.png`,
      alt: `${title} poster`,
    },
    shortDescription: richText(`${title} description from Payload`),
    performances: [],
    ticketsOnSale: false,
    ticketButtonLabel: 'Buy tickets',
    galleryImages: [
      {
        id: `${id}-gallery`,
        url: `http://localhost:3001/api/media/file/${id}-gallery.png`,
        alt: `${title} gallery`,
      },
    ],
    displayOrder: 0,
  };
}

function collectionPage(docs: Show[]) {
  return {
    docs,
    totalDocs: docs.length,
    limit: docs.length,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

describe('GalleryPage CMS integration', () => {
  beforeEach(() => {
    useGetCurrentShowQueryMock.mockReset();
    useGetShowsQueryMock.mockReset();
  });

  afterEach(cleanup);

  test('renders the selected current show and CMS past shows without duplicating the current show', () => {
    const currentShow = show('show-2027', 2027, 'CMS Current Show');
    const pastShow = show('show-2026', 2026, 'CMS Past Show');

    useGetCurrentShowQueryMock.mockReturnValue({
      data: currentShow,
      isLoading: false,
      isError: false,
    });
    useGetShowsQueryMock.mockReturnValue({
      data: collectionPage([currentShow, pastShow]),
      isLoading: false,
      isError: false,
    });

    render(<GalleryPage />);

    const currentSection = screen.getByRole('region', {
      name: 'Current show',
    });
    expect(within(currentSection).getByText('CMS Current Show')).toBeTruthy();
    expect(
      within(currentSection).getByText(
        'CMS Current Show description from Payload',
      ),
    ).toBeTruthy();
    expect(
      within(currentSection)
        .getByRole('img', { name: 'Current show poster' })
        .getAttribute('src'),
    ).toBe('http://localhost:3001/api/media/file/show-2027.png');

    const pastSection = screen.getByRole('region', { name: 'Past shows' });
    expect(within(pastSection).getByText('CMS Past Show')).toBeTruthy();
    expect(
      within(pastSection).getByText('CMS Past Show description from Payload'),
    ).toBeTruthy();
    expect(
      within(pastSection)
        .getByRole('img', { name: 'CMS Past Show gallery' })
        .getAttribute('src'),
    ).toBe('http://localhost:3001/api/media/file/show-2026-gallery.png');
    expect(within(pastSection).queryByText('CMS Current Show')).toBeNull();

    expect(useGetShowsQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({ depth: 1 }),
    );
  });

  test('renders an accessible loading state while Gallery content is requested', () => {
    useGetCurrentShowQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    useGetShowsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<GalleryPage />);

    expect(screen.getByRole('status').textContent).toMatch(/loading/i);
  });

  test('renders an accessible error state when Gallery content cannot be loaded', () => {
    useGetCurrentShowQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    useGetShowsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<GalleryPage />);

    expect(screen.getByRole('alert').textContent).toMatch(/gallery/i);
  });

  test('retries both requests when either Gallery request fails', () => {
    const refetchCurrentShow = vi.fn();
    const refetchShows = vi.fn();
    useGetCurrentShowQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      refetch: refetchCurrentShow,
    });
    useGetShowsQueryMock.mockReturnValue({
      isLoading: false,
      isError: true,
      refetch: refetchShows,
    });

    render(<GalleryPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(refetchCurrentShow).toHaveBeenCalledOnce();
    expect(refetchShows).toHaveBeenCalledOnce();
  });

  test('treats an unselected current show and an empty archive as empty content, not errors', () => {
    useGetCurrentShowQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    useGetShowsQueryMock.mockReturnValue({
      data: collectionPage([]),
      isLoading: false,
      isError: false,
    });

    render(<GalleryPage />);

    expect(screen.getByText('No current show selected.')).toBeTruthy();
    expect(screen.getByText('No past shows yet.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('region', { name: 'Past shows' })).toBeNull();
  });

  test('shows the full archive when no current show is selected, using CMS order then newest year', () => {
    const older = show('older', 2024, 'Older show');
    const newer = show('newer', 2026, 'Newer show');
    const promoted = {
      ...show('promoted', 2025, 'Promoted show'),
      displayOrder: -1,
    };
    useGetCurrentShowQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    useGetShowsQueryMock.mockReturnValue({
      data: collectionPage([older, newer, promoted]),
      isLoading: false,
      isError: false,
    });

    render(<GalleryPage />);

    expect(
      within(screen.getByRole('region', { name: 'Past shows' }))
        .getAllByRole('heading')
        .map((heading) => heading.textContent),
    ).toEqual(['Promoted show', 'Newer show', 'Older show']);
    expect(useGetShowsQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({ depth: 1, limit: 0 }),
    );
  });
});
