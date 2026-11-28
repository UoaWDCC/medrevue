import type { MediaAsset } from './Media';

export type AboutMedRevue = {
  heading: string;
  body: Record<string, unknown>;
  image: MediaAsset;
};
