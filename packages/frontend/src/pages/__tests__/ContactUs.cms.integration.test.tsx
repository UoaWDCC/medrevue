import { configureStore } from '@reduxjs/toolkit';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cmsApi } from '../../services/cms';
import ContactPage from '../ContactUs';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn<typeof fetch>() }));

// Only replace HTTP: keep the real hook, CmsClient, schema, mapper, and RichText.
vi.mock('../../services/cms/config', async () => {
  const { CmsClient } = await import('../../services/cms/CmsClient');
  return {
    cmsBaseUrl: 'http://cms.example',
    cmsClient: new CmsClient('http://cms.example', fetchMock),
  };
});

function payloadContact(revision: number) {
  return {
    id: 'contact-global',
    globalType: 'contact',
    pageTitle: `Contact the ${2026 + revision} team`,
    subtitle: `CMS subtitle ${revision}`,
    contactInformationHeading: `Talk to team ${revision}`,
    email: `team-${revision}@medrevue.example`,
    location: `CMS location ${revision}`,
    introduction: {
      root: {
        type: 'root',
        version: 1,
        direction: null,
        format: '',
        indent: 0,
        children: [
          {
            type: 'paragraph',
            version: 1,
            direction: null,
            format: '',
            indent: 0,
            children: [
              {
                type: 'text',
                version: 1,
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: `CMS introduction ${revision}`,
              },
            ],
          },
        ],
      },
    },
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function createTestStore() {
  return configureStore({
    reducer: { [cmsApi.reducerPath]: cmsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cmsApi.middleware),
  });
}

const stores: ReturnType<typeof createTestStore>[] = [];

function renderContact() {
  const store = createTestStore();
  stores.push(store);
  render(
    <Provider store={store}>
      <ContactPage />
    </Provider>,
  );
  return store;
}

async function refetchContact(store: ReturnType<typeof createTestStore>) {
  await act(async () => {
    await store.dispatch(
      cmsApi.endpoints.getContact.initiate(undefined, {
        forceRefetch: true,
        subscribe: false,
      }),
    );
  });
}

afterEach(() => {
  cleanup();
  for (const store of stores) store.dispatch(cmsApi.util.resetApiState());
  stores.length = 0;
  fetchMock.mockReset();
});

describe('ContactPage HTTP-to-render integration', () => {
  test('loads the contact global, renders rich text and mailto, and replaces content after refetch', async () => {
    let resolveResponse!: (response: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    fetchMock.mockReturnValueOnce(pendingResponse);
    const store = renderContact();

    expect(screen.getByRole('status').textContent).toMatch(/loading contact/i);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('http://cms.example/api/globals/contact');
    expect(options).toMatchObject({
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    expect(options?.signal?.aborted).toBe(false);

    await act(async () => resolveResponse(jsonResponse(payloadContact(1))));

    expect(
      await screen.findByRole('heading', { name: 'Contact the 2027 team' }),
    ).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByText('CMS subtitle 1')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Talk to team 1' }),
    ).toBeTruthy();
    expect(
      screen.getByText('CMS introduction 1').closest('strong'),
    ).not.toBeNull();
    expect(screen.getByText('CMS location 1')).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'team-1@medrevue.example' })
        .getAttribute('href'),
    ).toBe('mailto:team-1@medrevue.example');
    expect(screen.queryByText('aucklandmedicalrevue@gmail.com')).toBeNull();

    fetchMock.mockResolvedValueOnce(jsonResponse(payloadContact(2)));
    await refetchContact(store);

    expect(
      await screen.findByRole('heading', { name: 'Contact the 2028 team' }),
    ).toBeTruthy();
    expect(screen.getByText('CMS subtitle 2')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Talk to team 2' }),
    ).toBeTruthy();
    expect(
      screen.getByText('CMS introduction 2').closest('strong'),
    ).not.toBeNull();
    expect(screen.getByText('CMS location 2')).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'team-2@medrevue.example' })
        .getAttribute('href'),
    ).toBe('mailto:team-2@medrevue.example');
    for (const oldContent of [
      'Contact the 2027 team',
      'CMS subtitle 1',
      'Talk to team 1',
      'CMS introduction 1',
      'CMS location 1',
      'team-1@medrevue.example',
    ]) {
      expect(screen.queryByText(oldContent)).toBeNull();
    }
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('removes cleared or omitted optional content and uses the mapped heading fallback', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(payloadContact(1)));
    const store = renderContact();
    await screen.findByRole('heading', { name: 'Contact the 2027 team' });

    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        pageTitle: 'Contact with optional content removed',
        subtitle: '',
        contactInformationHeading: null,
        email: null,
        location: null,
        // Payload may omit introduction entirely rather than returning null.
      }),
    );
    await refetchContact(store);

    expect(
      await screen.findByRole('heading', {
        name: 'Contact with optional content removed',
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Contact Information' }),
    ).toBeTruthy();
    expect(screen.queryByText('CMS subtitle 1')).toBeNull();
    expect(screen.queryByText('CMS introduction 1')).toBeNull();
    expect(screen.queryByText('CMS location 1')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(document.querySelector('img')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test.each(['http', 'network', 'validation'] as const)(
    'shows an error for a %s failure and Retry makes a new request that renders recovered content',
    async (failure) => {
      if (failure === 'network') {
        fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
      } else if (failure === 'http') {
        fetchMock.mockResolvedValueOnce(
          jsonResponse({ message: 'CMS unavailable' }, 503),
        );
      } else {
        fetchMock.mockResolvedValueOnce(
          jsonResponse({ ...payloadContact(1), pageTitle: 2027 }),
        );
      }
      fetchMock.mockResolvedValueOnce(jsonResponse(payloadContact(2)));
      const store = renderContact();

      expect((await screen.findByRole('alert')).textContent).toMatch(
        /could not load.*contact/i,
      );
      expect(screen.queryByRole('heading')).toBeNull();
      expect(screen.queryByRole('link')).toBeNull();
      expect(
        cmsApi.endpoints.getContact.select()(store.getState()).error,
      ).toMatchObject({
        kind: failure,
      });
      expect(fetchMock).toHaveBeenCalledOnce();

      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

      expect(
        await screen.findByRole('heading', { name: 'Contact the 2028 team' }),
      ).toBeTruthy();
      await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
      expect(
        screen
          .getByRole('link', { name: 'team-2@medrevue.example' })
          .getAttribute('href'),
      ).toBe('mailto:team-2@medrevue.example');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    },
  );
});
