import { useMemo } from 'react';
import CardStack from '../../components/CardStack';
import CurrentShowCard from '../../components/Cards/CurrentShowCard';
import { useGetCurrentShowQuery, useGetShowsQuery } from '../../services/cms';
import { mapCurrentShowCard, mapPastShowCard } from './galleryCards';

export default function GalleryPage() {
  const currentShowQuery = useGetCurrentShowQuery();
  // Payload's limit 0 returns the full archive, rather than just its first page.
  const showsQuery = useGetShowsQuery({ depth: 1, limit: 0, sort: '-year' });
  const currentShow = currentShowQuery.data;
  const pastCards = useMemo(
    () =>
      (showsQuery.data?.docs ?? [])
        .filter((show) => show.id !== currentShow?.id)
        .sort((a, b) => a.displayOrder - b.displayOrder || b.year - a.year)
        .map(mapPastShowCard),
    [showsQuery.data, currentShow?.id],
  );

  if (currentShowQuery.isLoading || showsQuery.isLoading) {
    return (
      <output className="flex min-h-[50vh] items-center justify-center px-4 text-center">
        Loading gallery...
      </output>
    );
  }

  if (
    currentShowQuery.isError ||
    showsQuery.isError ||
    currentShow === undefined ||
    !showsQuery.data
  ) {
    return (
      <div
        role="alert"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <p>We could not load the gallery.</p>
        <button
          type="button"
          onClick={() => {
            void currentShowQuery.refetch();
            void showsQuery.refetch();
          }}
          disabled={currentShowQuery.isFetching || showsQuery.isFetching}
          className="rounded-full bg-background-secondary px-6 py-2 font-semibold hover:bg-secondary-darker disabled:opacity-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-[var(--color-background-secondary)]">
      <section className="bg-[var(--color-background-primary)] w-full min-h-[calc(100svh-5rem)] md:min-h-screen flex flex-col justify-center items-center gap-6 px-4 py-10 md:gap-10 md:py-0">
        <h1 className="font-bold text-[32px] md:text-[56px] text-[var(--color-background-secondary)]">
          Gallery
        </h1>
        {currentShow ? (
          <CurrentShowCard {...mapCurrentShowCard(currentShow)} />
        ) : (
          <p className="text-background-secondary">No current show selected.</p>
        )}
      </section>
      <section className="relative">
        <h2 className="font-bold pt-15 text-[32px] md:text-[56px] text-black text-center">
          Past Shows
        </h2>
        {pastCards.length > 0 ? (
          <CardStack cards={pastCards} />
        ) : (
          <p className="py-12 text-center">No past shows yet.</p>
        )}
      </section>
    </div>
  );
}
