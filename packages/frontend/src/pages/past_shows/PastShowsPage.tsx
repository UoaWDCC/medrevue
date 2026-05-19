import CardStack from '../../components/CardStack';
import CurrentShowCard, {
  type CurrentShowCardProps,
} from '../../components/Cards/CurrentShowCard';

export default function PastShowsPage() {
  const currentShowInfo: CurrentShowCardProps = {
    year: '2026',
    title: 'The Consultant of Oz',
    posterUrl: 'placeholder.png',
    description:
      "Auckland Medical Revue 2026 reimagines the iconic world of Oz through a bold and comedic medical lens. This year's production, The Consultant of Oz, brings together medical students from the University of Auckland in a high‑energy theatrical performance blending satire, music, and storytelling.",
    dates: '13th – 15th August 2026',
    time: '07:30pm – 10:00pm',
    doors: 'Doors open at 06:45pm',
    location:
      'SkyCity Theatre, Corner Hobson Street and Wellesley Street West, Auckland 1010',
  };

  return (
    <div>
      <section className="bg-[var(--colour-background-primary)] w-screen h-[100vh] flex flex-col justify-center items-center">
        <h1 className="font-bold text-[56px] pb-5 text-[var(--colour-background-secondary)]">
          Our 2026 Show
        </h1>
        <CurrentShowCard {...currentShowInfo} />
      </section>
      <h1 className="font-bold text-[56px] pb-5 text-[#000000] text-center">
        Past Shows
      </h1>
      <CardStack />
    </div>
  );
}
