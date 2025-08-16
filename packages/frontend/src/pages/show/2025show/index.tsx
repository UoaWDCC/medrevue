import type React from 'react';
import Show2025Poster from '../../../assets/medrevue-poster-2025.jpg';

const Show2025: React.FC = () => {
  return (
    <div className="m-0 p-0 bg-black">
      <div className="flex justify-center md:justify-center items-center">
        <a href="/buy" className="no-underline" aria-label="Buy tickets">
          <img
            src={Show2025Poster}
            alt="2025 Show"
            className="w-full max-w-5xl border-none"
          />
        </a>
      </div>
    </div>
  );
};

export default Show2025;
