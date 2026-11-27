import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PhotoViewerProps {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onChange: (index: number) => void;
}

export const PhotoViewer = ({
  images,
  index,
  title,
  onClose,
  onChange,
}: PhotoViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Tracks where a click started, so dragging from the image onto the backdrop doesn't close.
  const pointerDownOnBackdrop = useRef(false);

  const prev = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);

  // Layout effect so close() runs before React removes the dialog, which lets the
  // browser return focus to the thumbnail. showModal() traps focus and makes the page inert.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    // Hiding the scrollbar widens the page, so pad the body to stop the layout shifting.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  // Preload the neighbouring images so navigating doesn't flash an unloaded image.
  useEffect(() => {
    if (images.length <= 1) return;
    for (const url of [
      images[(index - 1 + images.length) % images.length],
      images[(index + 1) % images.length],
    ]) {
      new Image().src = url;
    }
  }, [images, index]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="m-0 flex h-dvh w-screen max-h-none max-w-none touch-pinch-zoom items-center justify-center overscroll-contain border-0 bg-black/90 p-0"
      onPointerDown={(e) => {
        pointerDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pointerDownOnBackdrop.current && e.target === e.currentTarget)
          onClose();
      }}
      // Keep React state as the source of truth instead of letting the browser close it.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Also covers the browser closing the dialog itself (e.g. Android back button).
      // Ignore stale close events from StrictMode's effect re-run, where the dialog is open again.
      onClose={() => {
        if (!dialogRef.current?.open) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }}
      aria-label={`${title} photo viewer`}
    >
      <button
        type="button"
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="absolute left-4 text-white text-4xl"
          onClick={prev}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <img
        src={images[index]}
        alt={`${title} gallery ${index + 1}`}
        className="max-w-[90vw] max-h-[85vh] object-contain"
      />

      {images.length > 1 && (
        <button
          type="button"
          className="absolute right-4 text-white text-4xl"
          onClick={next}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      <span className="absolute bottom-4 text-white text-sm" aria-live="polite">
        {index + 1} / {images.length}
      </span>
    </dialog>,
    document.body,
  );
};
