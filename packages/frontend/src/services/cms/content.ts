import { useEffect, useState } from 'react';

const configuredCmsBaseUrl = import.meta.env.VITE_CMS_BASE_URL?.trim();
export const cmsBaseUrl = (
  configuredCmsBaseUrl || 'http://localhost:3001'
).replace(/\/+$/, '');

export type CmsMedia =
  | string
  | {
      url?: string | null;
      alt?: string | null;
    }
  | null;

export type CmsRichText = string | Record<string, unknown> | null;

export type CmsShow = {
  title?: string;
  year?: number;
  poster?: CmsMedia;
  shortDescription?: CmsRichText;
  performances?: Array<{ startsAt?: string }>;
  venue?: string;
  address?: string;
  ticketsOnSale?: boolean;
  ticketLink?: string;
  ticketButtonLabel?: string;
};

export type CmsSponsor = {
  id?: string;
  name: string;
  logo?: CmsMedia;
  websiteUrl?: string;
  url?: string;
  tier?: 'platinum' | 'gold' | 'bronze';
  headline?: string;
  description?: CmsRichText;
  displayOrder?: number;
};

export type CmsPage<T> = { docs?: T[] };

export function useCmsResource<T>(resourcePath: string): T | null {
  const [resource, setResource] = useState<T | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${cmsBaseUrl}/api/${resourcePath}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`CMS request failed with status ${response.status}`);
        }
        return response.json() as Promise<T>;
      })
      .then((data) => setResource(data))
      .catch(() => {
        // Keep the existing local page content visible when the CMS is offline.
      });

    return () => controller.abort();
  }, [resourcePath]);

  return resource;
}

export function cmsAssetUrl(media?: CmsMedia): string | undefined {
  if (!media || typeof media === 'string' || !media.url) return undefined;

  try {
    return new URL(media.url, `${cmsBaseUrl}/`).toString();
  } catch {
    return undefined;
  }
}

export function cmsAssetAlt(
  media: CmsMedia | undefined,
  fallback: string,
): string {
  return media && typeof media !== 'string' && media.alt ? media.alt : fallback;
}
