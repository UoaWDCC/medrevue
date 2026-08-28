import { useEffect, useState } from 'react';

export type CmsQueryState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; data: T };

// runs an abortable CMS fetch on mount and whenever deps change
export function useCmsQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
): CmsQueryState<T> {
  const [state, setState] = useState<CmsQueryState<T>>({ status: 'loading' });

  // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied key, fetcher is intentionally excluded
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState({ status: 'error', error });
        }
      });

    return () => controller.abort();
  }, deps);

  return state;
}
