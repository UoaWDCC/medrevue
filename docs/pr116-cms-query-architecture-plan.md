# PR #116 – move CMS content onto the shared query architecture

PR #116 ("feat: added cms to 4 pages") branched from `dev` before #115 added the
shared CMS layer in `packages/frontend/src/services/cms/` (RTK Query `cmsApi` →
`CmsClient` → zod schema → mapper → model). It instead added a parallel
`services/cms/content.ts` with a `useCmsResource` hook (raw `fetch`, no
validation, no caching, swallowed errors) and raw Payload types used directly in
components. This plan migrates the PR onto the existing architecture and fixes
the review findings.

Branch: `fix/pr116-cms-query-architecture` (starts at the PR head `1f6beb5`).

## 1. Bring in `dev`

- `git merge origin/dev`. Conflicts: `packages/frontend/.env.example`,
  `packages/frontend/src/components/Footer/Footer.tsx`.
- Footer: keep `dev`'s `useGetSiteSettingsQuery` approach and port the PR's
  visible changes onto it (see step 4).

## 2. Add endpoints for the new resources

Follow the existing schema → mapper → model → `cmsApi` endpoint pattern exactly
(see `sponsorSchema.ts`, `mapSponsor.ts`, `models/Sponsor.ts`,
`mapOurCharity.ts`). Derive field shapes from the Payload config in
`packages/cms/src/globals/*.ts`, `packages/cms/src/collections/*.ts` and
`packages/cms/src/payload-types.ts`, not from the PR's inline types.

| Resource | Endpoint / hook | Notes |
|---|---|---|
| `globals/homepage` | `getHomepage` / `useGetHomepageQuery` | new |
| `globals/about-med-revue` | `getAboutMedRevue` / `useGetAboutMedRevueQuery` | new, depth 2 if it has media |
| `globals/sponsor-us` | `getSponsorUs` / `useGetSponsorUsQuery` | new; impact cards, statistics, contact link |
| `previous-sponsors` collection | `getPreviousSponsors` / `useGetPreviousSponsorsQuery` | new; sort `name`, `limit: 0`, depth 1 |
| `globals/our-charity` | existing `getOurCharity` | extend schema/mapper/model with any extra fields the Home page uses |
| `globals/current-show` | existing `getCurrentShow` | reuse as is |
| `sponsors` | existing `getActiveSponsors` | reuse as is |
| `globals/site-settings` | existing `getSiteSettings` | extend if Footer needs extra fields |
| `globals/theme-settings` | existing `getThemeSettings` | reuse as is |

Mapper rules (these remove most of the review findings at the source):

- Optional strings: `value?.trim() || undefined`.
- Optional arrays: always return an array (`?? []`).
- Media: use `mapMedia`; for optional media, map to `undefined` when absent.
- URLs from the CMS: sanitise once in the mapper with a single shared helper
  (see step 3); invalid → `undefined`.
- Optional `websiteUrl`/`url` on sponsors → `string | undefined` in the model.
  Check whether `websiteUrl` is actually required in `Sponsors.ts`; make the
  schema match the CMS config.

Register each new endpoint in `cmsApi.ts` and export the hooks, models and
adapters from `services/cms/index.ts`.

## 3. One URL safety helper

Replace `safeWebUrl`, the inline footer regex (`Footer.tsx`), `safeLinkUrl`
(`RichText.tsx`) and `safeContactHref` (`SponsorPage.tsx`) with one helper, e.g.
`services/cms/safeHref.ts`:

```ts
// Allows http(s), mailto, tel and site-relative paths. Returns undefined otherwise.
export function safeHref(value: string | null | undefined): string | undefined
```

Use it in mappers, and in `RichText.tsx` for link nodes.

## 4. Move components onto the hooks

- Delete `services/cms/content.ts`. Replace every `useCmsResource` call with the
  matching hook and use the mapped models (`Sponsor`, `Show`, `MediaAsset`, …)
  in component props instead of `CmsSponsor`/`CmsShow`/`CmsMedia`.
  Call sites: `App.tsx`, `Footer.tsx`, `pages/Home.tsx`, `pages/SponsorPage.tsx`,
  and the components they feed.
- Keep the PR's local fallback content: render it while loading or on error.

## 5. Fix the remaining review findings

1. **SponsorsSection** (`SponsorLogoLink`): drop the `'websiteUrl' in sponsor`
   check. Convert the local fallback sponsors to the same shape as the mapped
   `Sponsor` (or a small shared display type) so one code path renders both.
2. **Sponsor links**: when a sponsor has no URL, render the logo without an
   `<a>` – no `href="#"`, no `target="_blank"`. Same in `PreviousSponsors`:
   show the logo even when there is no URL (don't filter it out).
3. **Footer social links**: fall back per field –
   `siteSettings?.facebookUrl ?? DEFAULT_FACEBOOK_URL` – so blank CMS fields
   keep the default icons.
4. **SponsorPage arrays**: use defaults when the CMS array is empty, not only
   when it is null (`cards.length ? cards : DEFAULT_CARDS`).
5. **SponsorPage Contact Us**: internal paths (`/…`) use react-router `<Link>`;
   external links use `<a>`.
6. **HeroSection dates**: sort performances by `startsAt` before formatting, and
   show a range (`13 – 15 Aug 2026`) when there are several dates, matching the
   previous display. Use the array index (or a stable field name) as the React
   key for the details list, not the text.
7. **Theme flash** (`App.tsx`): use `useGetThemeSettingsQuery`. Save the last
   applied colours to `localStorage` (wrapped in try/catch) and apply them
   synchronously before first render (e.g. in `main.tsx`), then update when the
   query resolves. Skip on `/admin` paths.
8. **Base URL**: there must be only one `cmsBaseUrl` (in `config.ts`). Leave its
   current fallback behaviour as it is on `dev` – changing production config is
   out of scope; just ensure the duplicate is gone.

## 6. Tests

Keep it light. Add mapper tests only for the new mappers, following
`services/cms/__tests__/map*.test.ts` (one happy path plus the empty/missing
field case that motivated the mapper rule). Update any existing tests broken
by the migration.

## 7. Verify

From `packages/frontend`: `npx tsc -b`, `npm run lint`, `npx vitest run`,
`npm run build`. All must pass.

## Out of scope

- CMS (`packages/cms`) schema changes.
- Visual/design changes beyond the bugs above.
