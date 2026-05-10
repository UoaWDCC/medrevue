import React from 'react';

interface CarouselScrollingProps {
  children: React.ReactElement[];
  itemWidth: number;
}

export const CarouselScrolling: React.FC<CarouselScrollingProps> = ({
  children,
  itemWidth,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const childrenArray = React.Children.toArray(
    children,
  ) as React.ReactElement[];
  const totalItems = childrenArray.length;

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / itemWidth);
      setActiveIndex(index);
    }
  };

  const scrollLeft = () => {
    const index = activeIndex === 0 ? totalItems - 1 : activeIndex - 1;
    scrollToIndex(index);
  };

  const scrollRight = () => {
    const index = activeIndex === totalItems - 1 ? 0 : activeIndex + 1;
    scrollToIndex(index);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-fit mx-auto">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={scrollLeft}
          className=" bg-white border rounded-full w-8 h-8 flex items-center justify-center shadow"
        >
          ←
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
          style={{ width: itemWidth, scrollbarWidth: 'none' }}
        >
          {childrenArray.map((child) => (
            <div
              key={(child as React.ReactElement).key}
              className="flex-none snap-start"
              style={{ width: itemWidth }}
            >
              {child}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollRight}
          className=" bg-white border rounded-full w-8 h-8 flex items-center justify-center shadow"
        >
          →
        </button>
      </div>

      <div className="flex justify-center gap-2 w-full">
        {childrenArray.map((child, index) => (
          <button
            key={`dot-${(child as React.ReactElement).key}`}
            type="button"
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
