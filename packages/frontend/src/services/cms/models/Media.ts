export type MediaAsset = {
  id: string;
  // Resized WebP copy when available, otherwise the original upload
  url: string;
  thumbnailUrl: string;
  alt: string;
  width?: number;
  height?: number;
};
