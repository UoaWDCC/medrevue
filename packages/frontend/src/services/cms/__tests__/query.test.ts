import { describe, expect, test } from 'vitest';
import { buildCmsQuery } from '../query';

describe('buildCmsQuery', () => {
  test('returns an empty string for an empty query', () => {
    expect(buildCmsQuery({})).toBe('');
  });

  test('serializes Payload collection options and nested filters', () => {
    const query = buildCmsQuery({
      where: {
        isCurrentShow: {
          equals: true,
        },
      },
      depth: 1,
      limit: 1,
    });

    const params = new URLSearchParams(query);
    expect(params.get('where[isCurrentShow][equals]')).toBe('true');
    expect(params.get('depth')).toBe('1');
    expect(params.get('limit')).toBe('1');
  });
});
