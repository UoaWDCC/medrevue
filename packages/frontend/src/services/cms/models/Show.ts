import type { MediaAsset } from './Media';

export type Performance = {
  id?: string;
  startsAt: string;
  endsAt?: string;
  doorsOpenAt?: string;
};

export type Show = {
  id: string;
  title: string;
  year: number;
  poster: MediaAsset;
  isCurrentShow: boolean;
  shortDescription?: Record<string, unknown>;
  performances: Performance[];
  venue?: string;
  address?: string;
  ticketsOnSale: boolean;
  ticketLink?: string;
  ticketButtonLabel: string;
  galleryImages: MediaAsset[];
  displayOrder: number;
};
