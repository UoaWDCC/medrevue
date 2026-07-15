import type React from 'react';

interface AboutPhotoProps {
  src: string;
  alt: string;
  zoomed?: boolean;
  rotation?: 'clockwise' | 'anticlockwise';
}

const rotationClasses = {
  clockwise: 'rotate-[8deg]',
  anticlockwise: '-rotate-[9deg]',
};

export const AboutPhoto: React.FC<AboutPhotoProps> = ({
  src,
  alt,
  zoomed = false,
  rotation,
}) => {
  const rotationClass = rotation ? rotationClasses[rotation] : '';
  const frameScaleClass = rotation ? 'scale-90' : '';
  const imageClass = zoomed ? 'scale-[1.3] object-center' : '';

  return (
    <div
      className={`w-full bg-background-white px-2 pt-8 pb-14 md:px-2 md:pt-6 md:pb-14 ${rotationClass} ${frameScaleClass}`}
    >
      <div className="h-64 md:h-[450px] w-full overflow-hidden">
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${imageClass}`}
        />
      </div>
    </div>
  );
};
