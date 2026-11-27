export class CmsHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
  ) {
    super(`CMS request failed with status ${status}`);
    this.name = 'CmsHttpError';
  }
}

export class CmsNetworkError extends Error {
  constructor(
    public readonly url: string,
    public readonly cause?: unknown,
  ) {
    super('Could not connect to the CMS');
    this.name = 'CmsNetworkError';
  }
}

export class CmsValidationError extends Error {
  constructor(
    public readonly resource: string,
    public readonly cause?: unknown,
  ) {
    super(`CMS returned invalid data for ${resource}`);
    this.name = 'CmsValidationError';
  }
}
