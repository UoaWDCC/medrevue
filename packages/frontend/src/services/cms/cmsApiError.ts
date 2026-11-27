import { CmsHttpError, CmsNetworkError, CmsValidationError } from './errors';

export type CmsApiError =
  | {
      kind: 'http';
      message: string;
      status: number;
      url: string;
    }
  | {
      kind: 'network';
      message: string;
      url: string;
    }
  | {
      kind: 'validation';
      message: string;
      resource: string;
    }
  | {
      kind: 'unknown';
      message: string;
    };

export function toCmsApiError(error: unknown): CmsApiError {
  if (error instanceof CmsHttpError) {
    return {
      kind: 'http',
      message: error.message,
      status: error.status,
      url: error.url,
    };
  }

  if (error instanceof CmsNetworkError) {
    return {
      kind: 'network',
      message: error.message,
      url: error.url,
    };
  }

  if (error instanceof CmsValidationError) {
    return {
      kind: 'validation',
      message: error.message,
      resource: error.resource,
    };
  }

  return {
    kind: 'unknown',
    message: error instanceof Error ? error.message : 'Unexpected CMS error',
  };
}
