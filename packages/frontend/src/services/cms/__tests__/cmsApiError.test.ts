import { describe, expect, test } from 'vitest';
import { toCmsApiError } from '../cmsApiError';
import { CmsHttpError, CmsNetworkError, CmsValidationError } from '../errors';

describe('toCmsApiError', () => {
  test('converts HTTP errors', () => {
    expect(toCmsApiError(new CmsHttpError(404, 'http://x/shows'))).toEqual({
      kind: 'http',
      message: 'CMS request failed with status 404',
      status: 404,
      url: 'http://x/shows',
    });
  });

  test('converts network errors without retaining their cause', () => {
    const cause = new TypeError('Failed to fetch');

    expect(toCmsApiError(new CmsNetworkError('http://x/shows', cause))).toEqual(
      {
        kind: 'network',
        message: 'Could not connect to the CMS',
        url: 'http://x/shows',
      },
    );
  });

  test('converts validation errors without retaining their cause', () => {
    const cause = new Error('Invalid response');

    expect(toCmsApiError(new CmsValidationError('shows', cause))).toEqual({
      kind: 'validation',
      message: 'CMS returned invalid data for shows',
      resource: 'shows',
    });
  });

  test('preserves the message from an unexpected Error', () => {
    expect(toCmsApiError(new Error('Unexpected failure'))).toEqual({
      kind: 'unknown',
      message: 'Unexpected failure',
    });
  });

  test('uses a safe fallback for non-Error values', () => {
    expect(toCmsApiError('failure')).toEqual({
      kind: 'unknown',
      message: 'Unexpected CMS error',
    });
  });
});
