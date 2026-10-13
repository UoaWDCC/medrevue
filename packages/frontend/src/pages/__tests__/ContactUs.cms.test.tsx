import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ContactPage } from '../ContactUs';

const { useGetContactQueryMock } = vi.hoisted(() => ({
  useGetContactQueryMock: vi.fn(),
}));

vi.mock('../../services/cms', () => ({
  useGetContactQuery: useGetContactQueryMock,
}));

const introduction = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This introduction came from Payload.',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
};

function contactQueryResult(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      pageTitle: 'Contact the 2027 team',
      subtitle: 'We would love to hear from you.',
      introduction,
      contactInformationHeading: 'Talk to us',
      email: 'cms-contact@medrevue.example',
      location: 'CMS-managed location',
    },
    isLoading: false,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
    ...overrides,
  };
}

describe('ContactPage CMS integration', () => {
  beforeEach(() => {
    useGetContactQueryMock.mockReset();
  });

  afterEach(cleanup);

  test('renders Contact content returned by Payload, including rich text and mailto link', () => {
    useGetContactQueryMock.mockReturnValue(contactQueryResult());

    render(<ContactPage />);

    expect(
      screen.getByRole('heading', { name: 'Contact the 2027 team' }),
    ).toBeTruthy();
    expect(screen.getByText('We would love to hear from you.')).toBeTruthy();
    expect(
      screen.getByText('This introduction came from Payload.'),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Talk to us' })).toBeTruthy();
    expect(screen.getByText('CMS-managed location')).toBeTruthy();

    const emailLink = screen.getByRole('link', {
      name: 'cms-contact@medrevue.example',
    });
    expect(emailLink.getAttribute('href')).toBe(
      'mailto:cms-contact@medrevue.example',
    );

    expect(screen.queryByText('aucklandmedicalrevue@gmail.com')).toBeNull();
  });

  test('omits optional subtitle, email, and location when Payload leaves them empty', () => {
    useGetContactQueryMock.mockReturnValue(
      contactQueryResult({
        data: {
          pageTitle: 'Contact the team',
          contactInformationHeading: 'Contact information',
        },
      }),
    );

    render(<ContactPage />);

    expect(screen.queryByText('Want to get in touch?')).toBeNull();
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(screen.queryByText('85 Park Road, Grafton, Auckland')).toBeNull();
  });

  test('renders an accessible loading state while Contact content is requested', () => {
    useGetContactQueryMock.mockReturnValue(
      contactQueryResult({ data: undefined, isLoading: true }),
    );

    render(<ContactPage />);

    expect(screen.getByRole('status').textContent).toMatch(/loading/i);
  });

  test('renders a retryable error state and retries the Contact request', () => {
    const refetch = vi.fn();
    useGetContactQueryMock.mockReturnValue(
      contactQueryResult({
        data: undefined,
        isError: true,
        error: { kind: 'network', message: 'CMS unavailable' },
        refetch,
      }),
    );

    render(<ContactPage />);

    expect(screen.getByRole('alert').textContent).toMatch(/contact/i);
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(refetch).toHaveBeenCalledOnce();
  });
});
