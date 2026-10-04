import type React from 'react';
import { useState } from 'react';
import { PhotoViewer } from './PhotoViewer';

export interface PastShowCardProps {
  year: string;
  title: string;
  description: string;
  posterUrl: string;
  galleryUrls: string[];
}

export const PastShowCard: React.FC<PastShowCardProps> = ({
  year,
  title,
  description,
  posterUrl,
  galleryUrls,
}) => {};

export default PastShowCard;
