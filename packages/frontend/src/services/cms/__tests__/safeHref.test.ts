import { describe, expect, test } from 'vitest';
import { safeHref } from '../safeHref';

describe('safeHref', () => {
  test.each([
    'https://example.com/path',
    'http://example.com',
    'mailto:hello@example.com',
    'tel:+6491234567',
    '/contact',
  ])('allows %s', (href) => {
    expect(safeHref(href)).toBe(href);
  });

  test.each([
    'javascript:alert(1)',
    'data:text/html,hi',
    '//evil.example.com',
    '/\\evil.example.com',
    '/\t/evil.example.com',
    'not a url',
    '   ',
    null,
    undefined,
  ])('rejects %s', (href) => {
    expect(safeHref(href)).toBeUndefined();
  });
});
