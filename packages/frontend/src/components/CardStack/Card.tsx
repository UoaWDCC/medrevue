import './Card.css';

export interface PastShowCardProps {
  name: string;
}

export default function Card({ info }: { info: PastShowCardProps }) {
  return (
    <div className="card">
      <p>{info.name}</p>
    </div>
  );
}
