import { stringify } from 'qs-esm';

// turn frontend data for a collection/global into Payload compatible query
export function buildCmsQuery(query: object): string {
  return stringify(query, {
    addQueryPrefix: true,
  });
}
