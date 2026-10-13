export function getExternalUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function getSiteLink(value?: string): string | undefined {
  const link = value?.trim();
  if (!link) return undefined;

  // Root-relative routes are internal; protocol-relative URLs are not.
  if (link.startsWith('/') && !link.startsWith('//') && !link.includes('\\')) {
    return link;
  }

  return getExternalUrl(link);
}
