const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

// Allows http(s), mailto, tel and site-relative paths. Returns undefined otherwise.
export function safeHref(value: string | null | undefined): string | undefined {
  const href = value?.trim();
  if (!href) return undefined;

  // Root-relative paths are internal; protocol-relative URLs are not.
  if (href.startsWith('/') && !href.startsWith('//') && !href.includes('\\')) {
    return href;
  }

  try {
    return ALLOWED_PROTOCOLS.includes(new URL(href).protocol)
      ? href
      : undefined;
  } catch {
    return undefined;
  }
}
