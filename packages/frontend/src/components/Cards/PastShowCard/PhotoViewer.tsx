import { useCallback, useEffect } from 'react'; // useCallback keeps prev/next stable between redraws
import { createPortal } from 'react-dom'; // draws the viewer outside the card

// The list of things PastShowCard must hand to the viewer
interface PhotoViewerProps {
  images: string[]; // every image URL for this show
  index: number; // which image is showing right now
  title: string; // show title, used for accessibility text
  onClose: () => void; // function to call to close the viewer
  onChange: (index: number) => void; // function to call to switch images
}

export const PhotoViewer = ({
  images,
  index,
  title,
  onClose,
  onChange,
}: PhotoViewerProps) => {
  // Go back one image; "+ images.length" stops the number going negative.
  // useCallback: only rebuild this function if one of the values in the list changes.
  const prev = useCallback(
    () => onChange((index - 1 + images.length) % images.length),
    [index, images.length, onChange],
  );

  // Go forward one image; "%" wraps back to 0 after the last image.
  const next = useCallback(
    () => onChange((index + 1) % images.length),
    [index, images.length, onChange],
  );

  // useEffect is for things outside React's drawing, like browser key events.
  useEffect(() => {
    // Runs on every key press while the viewer is open
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    // Start listening for key presses
    window.addEventListener('keydown', onKey);
    // Stop the page scrolling behind the overlay
    document.body.style.overflow = 'hidden';

    // Cleanup: runs when the viewer closes
    return () => {
      // Stop listening so listeners don't pile up
      window.removeEventListener('keydown', onKey);
      // Let the page scroll again
      document.body.style.overflow = '';
    };
    // Re-run if any of the functions the effect uses are rebuilt
  }, [prev, next, onClose]);

  return createPortal(
    // Backdrop: "fixed inset-0" covers the whole screen.
    <dialog
      open
      className="fixed inset-0 z-50 m-0 flex h-screen w-screen max-h-none max-w-none items-center justify-center border-0 bg-black/90 p-0" // ← CHANGED: extra classes added
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // If the user presses Escape, close the viewer.
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      aria-modal="true"
      aria-label={`${title} photo viewer`}
    >
      {/* Close button, top right */}
      <button
        type="button"
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {/* Previous arrow to go back in the images */}
      {images.length > 1 && (
        <button
          type="button"
          className="absolute left-4 text-white text-4xl"
          onClick={(e) => {
            // Stop the click from bubbling up to the backdrop.
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* The main image */}
      <img
        // The image currently selected
        src={images[index]}
        alt={`${title} gallery ${index + 1}`}
        // Fit the screen without cropping
        className="max-w-[90vw] max-h-[85vh] object-contain"
      />

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          type="button"
          className="absolute right-4 text-white text-4xl"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Counter of what image the user is viewing */}
      <span className="absolute bottom-4 text-white text-sm">
        {/* Shows the current image number out of the total */}
        {index + 1} / {images.length}
      </span>
    </dialog>,
    document.body, // draw it at the top level of the page, not inside the card
  );
};
