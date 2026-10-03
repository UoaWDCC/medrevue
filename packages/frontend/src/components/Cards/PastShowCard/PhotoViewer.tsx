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
};
