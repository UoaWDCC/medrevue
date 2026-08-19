import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import { type CmsAdapter, CmsClient } from '../CmsClient';
import { CmsHttpError, CmsNetworkError, CmsValidationError } from '../errors';

const documentSchema = z.object({ id: z.string() });
type Document = z.infer<typeof documentSchema>;

const documentAdapter: CmsAdapter<Document, Document> = {
  schema: documentSchema,
  map: (document) => document,
};

const collectionResponse = {
  docs: [{ id: 'show-2026' }],
  totalDocs: 1,
  limit: 1,
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('CmsClient', () => {
  test('builds a collection URL and returns validated documents', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValue(jsonResponse(collectionResponse));
    const client = new CmsClient('http://localhost:3001', fetchMock);

    const result = await client.getCollection(
      'shows',
      {
        where: { isCurrentShow: { equals: true } },
        depth: 1,
        limit: 1,
      },
      documentAdapter,
    );

    expect(result.docs).toEqual([{ id: 'show-2026' }]);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [requestUrl, requestOptions] = fetchMock.mock.calls[0];
    const url = new URL(String(requestUrl));
    expect(url.origin).toBe('http://localhost:3001');
    expect(url.pathname).toBe('/api/shows');
    expect(url.searchParams.get('where[isCurrentShow][equals]')).toBe('true');
    expect(url.searchParams.get('depth')).toBe('1');
    expect(url.searchParams.get('limit')).toBe('1');
    expect(requestOptions).toMatchObject({
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  });

  test('builds the correct global URL', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValue(jsonResponse({ id: 'homepage' }));
    const client = new CmsClient('http://localhost:3001/', fetchMock);

    const result = await client.getGlobal(
      'homepage',
      { depth: 1 },
      documentAdapter,
    );

    expect(result).toEqual({ id: 'homepage' });
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.origin).toBe('http://localhost:3001');
    expect(url.pathname).toBe('/api/globals/homepage');
    expect(url.searchParams.get('depth')).toBe('1');
  });

  test('throws CmsHttpError for an unsuccessful HTTP status', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Server error' }, 500));
    const client = new CmsClient('http://localhost:3001', fetchMock);

    const request = client.getCollection('shows', {}, documentAdapter);
    await expect(request).rejects.toBeInstanceOf(CmsHttpError);
    await expect(request).rejects.toMatchObject({ status: 500 });
  });

  test('throws CmsNetworkError when fetch cannot connect', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const client = new CmsClient('http://localhost:3001', fetchMock);

    await expect(
      client.getCollection('shows', {}, documentAdapter),
    ).rejects.toBeInstanceOf(CmsNetworkError);
  });

  test('throws CmsValidationError for an invalid collection response', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValue(jsonResponse({ docs: 'not an array' }));
    const client = new CmsClient('http://localhost:3001', fetchMock);

    await expect(
      client.getCollection('shows', {}, documentAdapter),
    ).rejects.toBeInstanceOf(CmsValidationError);
  });
});
