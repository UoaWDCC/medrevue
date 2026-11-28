import type { CollectionConfig } from 'payload';

// Smaller WebP copies so the site doesn't download full-size originals.
// `fit: 'inside'` keeps the aspect ratio within the box, and
// `withoutEnlargement` still converts images smaller than the box to WebP.
const webpSize = (name: string, maxDimension: number) => ({
  name,
  width: maxDimension,
  height: maxDimension,
  fit: 'inside' as const,
  withoutEnlargement: true,
  formatOptions: { format: 'webp' as const, options: { quality: 80 } },
  // Images smaller than both boxes come out the same size for every size, so
  // the default `name-WxH` filename clashes and Vercel Blob rejects the upload.
  generateImageName: ({
    originalName,
    sizeName,
    width,
    height,
    extension,
  }: {
    originalName: string;
    sizeName: string;
    width: number;
    height: number;
    extension: string;
  }) => `${originalName}-${sizeName}-${width}x${height}.${extension}`,
});

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [webpSize('thumbnail', 640), webpSize('large', 1600)],
  },
};
