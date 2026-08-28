import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useCmsQuery } from '../hooks/useCmsQuery';

describe('useCmsQuery', () => {
  test('resolves to a success state with the fetched data', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 'show-2026' });
    const { result } = renderHook(() => useCmsQuery(fetcher, []));

    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current).toEqual({
        status: 'success',
        data: { id: 'show-2026' },
      });
    });
  });

  test('resolves to an error state when the fetcher rejects', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('CMS unreachable'));
    const { result } = renderHook(() => useCmsQuery(fetcher, []));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
  });

  test('aborts the in-flight request on unmount', async () => {
    const fetcher = vi.fn().mockReturnValue(new Promise(() => {}));
    const { unmount } = renderHook(() => useCmsQuery(fetcher, []));

    const signal = fetcher.mock.calls[0][0] as AbortSignal;
    expect(signal.aborted).toBe(false);

    unmount();
    expect(signal.aborted).toBe(true);
  });

  test('re-fetches when deps change', async () => {
    const fetcher = vi.fn().mockResolvedValue('data');
    const { rerender } = renderHook(({ dep }) => useCmsQuery(fetcher, [dep]), {
      initialProps: { dep: 'a' },
    });

    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));

    rerender({ dep: 'b' });
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  });
});
