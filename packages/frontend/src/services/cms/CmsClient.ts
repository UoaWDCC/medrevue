import { type ZodType, z } from 'zod';
import { CmsHttpError, CmsNetworkError, CmsValidationError } from './errors';
import { buildCmsQuery } from './query';

export type CmsWhere = Record<string, unknown>;

export type CollectionOptions = {
  where?: CmsWhere;
  depth?: number;
  limit?: number;
  page?: number;
  sort?: string;
  signal?: AbortSignal;
};

export type GlobalOptions = {
  depth?: number;
  signal?: AbortSignal;
};

export type CmsPage<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type CmsMappingContext = {
  cmsBaseUrl: string;
};

export type CmsAdapter<TRaw, TModel> = {
  schema: ZodType<TRaw>;
  map: (value: TRaw, context: CmsMappingContext) => TModel;
};

type FetchFunction = typeof fetch;

const cmsPageEnvelopeSchema = z
  .object({
    docs: z.array(z.unknown()),
    totalDocs: z.number(),
    limit: z.number(),
    page: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  })
  .passthrough();

export class CmsClient {
  private readonly baseUrl: string;
  private readonly fetchFunction: FetchFunction;

  constructor(baseUrl: string, fetchFunction: FetchFunction = fetch) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.fetchFunction = fetchFunction;
  }

  // collection urls created here
  async getCollection<TRaw, TModel>(
    slug: string,
    options: CollectionOptions,
    adapter: CmsAdapter<TRaw, TModel>,
  ): Promise<CmsPage<TModel>> {
    const { signal, ...query } = options;
    const queryString = buildCmsQuery(query);
    const url = `${this.baseUrl}/api/${encodeURIComponent(slug)}${queryString}`;
    const data = await this.getJson(url, signal);

    const envelope = cmsPageEnvelopeSchema.safeParse(data);
    if (!envelope.success) {
      throw new CmsValidationError(slug, envelope.error);
    }

    return {
      docs: envelope.data.docs.map((document) =>
        this.parseAndMap(document, slug, adapter),
      ),
      totalDocs: envelope.data.totalDocs,
      limit: envelope.data.limit,
      page: envelope.data.page,
      totalPages: envelope.data.totalPages,
      hasNextPage: envelope.data.hasNextPage,
      hasPrevPage: envelope.data.hasPrevPage,
    };
  }

  // create global url
  async getGlobal<TRaw, TModel>(
    slug: string,
    options: GlobalOptions,
    adapter: CmsAdapter<TRaw, TModel>,
  ): Promise<TModel> {
    const { signal, ...query } = options;
    const queryString = buildCmsQuery(query);
    const url = `${this.baseUrl}/api/globals/${encodeURIComponent(slug)}${queryString}`;
    const data = await this.getJson(url, signal);

    return this.parseAndMap(data, slug, adapter);
  }

  private parseAndMap<TRaw, TModel>(
    data: unknown,
    resource: string,
    adapter: CmsAdapter<TRaw, TModel>,
  ): TModel {
    const parsed = adapter.schema.safeParse(data);
    if (!parsed.success) {
      throw new CmsValidationError(resource, parsed.error);
    }

    try {
      return adapter.map(parsed.data, { cmsBaseUrl: this.baseUrl });
    } catch (cause) {
      throw new CmsValidationError(resource, cause);
    }
  }

  // make HTTP request to Payload CMS to get data from created url
  private async getJson(url: string, signal?: AbortSignal): Promise<unknown> {
    let response: Response;

    try {
      response = await this.fetchFunction(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal,
      });
    } catch (cause) {
      throw new CmsNetworkError(url, cause);
    }

    if (!response.ok) {
      throw new CmsHttpError(response.status, url);
    }

    try {
      return await response.json();
    } catch (cause) {
      throw new CmsValidationError(url, cause);
    }
  }
}
