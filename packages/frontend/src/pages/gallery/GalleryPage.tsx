import poster from '../../assets/medrevue-poster-2026.png';
import CardStack from '../../components/CardStack';
import CurrentShowCard, {
  type CurrentShowCardProps,
} from '../../components/Cards/CurrentShowCard';

export default function PastShowsPage() {
  const currentShowInfo: CurrentShowCardProps = {
    year: '2026',
    title: 'The Consultant of Oz',
    posterUrl: poster,
    description:
      "Auckland Medical Revue 2026 reimagines the iconic world of Oz through a bold and comedic medical lens. This year's production, The Consultant of Oz, brings together medical students from the University of Auckland in a high‑energy theatrical performance blending satire, music, and storytelling.",
    dates: '13th – 15th August 2026',
    time: '07:30pm – 10:00pm',
    doors: 'Doors open at 06:45pm',
    location:
      'SkyCity Theatre, Corner Hobson Street and Wellesley Street West, Auckland 1010',
  };

  return (
    <div className="overflow-x-hidden bg-[var(--color-background-secondary)]">
      <section className="bg-[var(--color-background-primary)] w-screen h-[100vh] flex flex-col justify-center items-center">
        <h1 className="font-bold text-[32px] md:text-[56px] pb-10 text-[var(--color-background-secondary)]">
          Gallery
        </h1>
        <CurrentShowCard {...currentShowInfo} />
      </section>
      <section className="w-full absolute flex justify-center mt-15">
        <h1 className="font-bold absolute top-0 text-[32px] md:text-[56px] text-[#000000] text-center">
          Past Shows
        </h1>
      </section>
      <CardStack />
    </div>
  );
}
