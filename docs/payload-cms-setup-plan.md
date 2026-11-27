# Payload CMS Setup Plan

## Goal

Add a Payload CMS app backed by MongoDB so admin users can manage previous
sponsors. A previous sponsor has:

- `name`
- `logo`
- `url`

The existing Vite website remains a separate public frontend. It reads sponsor
content from Payload's REST API. Payload provides the admin UI and content API.

## Target Architecture

```text
Public visitors
    |
    v
Vite frontend served by nginx on Fly.io
    |
    | GET /api/previous-sponsors
    v
Payload CMS app on Fly.io
    |
    v
MongoDB

Admin users
    |
    v
Payload admin UI
```

Uploaded logos are stored on local disk during development. Before deploying
Payload to Fly.io, configure object storage such as Tigris or Cloudflare R2
because the Fly Machine filesystem is ephemeral.

## Repository Structure

```text
packages/
  frontend/                 # Existing Vite public website
  cms/                      # New Payload and Next.js app
  types/                    # Shared types where useful

legacy/
  backend/                  # Archived ticketing backend, retained for reference

compose.yaml                # Local MongoDB service
Dockerfile                  # Public frontend image
Dockerfile.cms              # Payload image, added before CMS deployment
fly.toml                    # Public frontend Fly app
fly.cms.toml                # Payload Fly app, added before CMS deployment
```

## Completed Groundwork

- The old ticketing backend has been moved to `legacy/backend`.
- The active npm workspace contains only `packages/frontend` and
  `packages/types`.
- The public website Docker image builds only the Vite frontend.
- nginx serves the compiled frontend on port `3000`.
- nginx falls back to `index.html` so React Router routes work when opened
  directly.
- The deployment build uses npm and `package-lock.json`, not Yarn.
- `compose.yaml` defines a local MongoDB container with a persistent Docker
  volume.

## Phase 1: Finish Frontend Deployment Cleanup

1. Delete `yarn.lock`.
2. Update `README.md` to describe the current deployment:
   - npm is used for dependency installation.
   - Vite builds the public frontend.
   - nginx serves the compiled files.
   - the legacy ticketing backend is no longer deployed.
3. Add `legacy/backend/README.md` explaining that the ticketing code is
   archived for reference and is not actively maintained.
4. Verify the public frontend image:

   ```bash
   docker build -t medrevue .
   docker run --rm -p 3000:3000 medrevue
   ```

5. Open `http://localhost:3000` and verify direct navigation to routes such as
   `http://localhost:3000/sponsors`.

## Phase 2: Run MongoDB Locally

Use the MongoDB service already defined in `compose.yaml`:

```bash
docker compose up -d mongo
```

The local Payload connection string will be:

```text
mongodb://localhost:27017/medrevue-cms
```

Useful commands:

```bash
docker compose ps
docker compose logs mongo
docker compose down
```

Do not use `docker compose down -v` during normal development because `-v`
deletes the MongoDB volume and its data.

## Phase 3: Scaffold Payload

1. Create `packages/cms` as a Payload Next.js app using npm.
2. Add `./packages/cms` to the root `workspaces` array.
3. Add root scripts:

   ```json
   {
     "dev:cms": "npm run dev --workspace @medrevue/cms",
     "build:cms": "npm run build --workspace @medrevue/cms"
   }
   ```

4. Configure Payload to use the official MongoDB adapter:

   ```ts
   import { mongooseAdapter } from '@payloadcms/db-mongodb';

   db: mongooseAdapter({
     url: process.env.DATABASE_URL!,
   })
   ```

5. Add `packages/cms/.env.example`:

   ```text
   DATABASE_URL=mongodb://localhost:27017/medrevue-cms
   PAYLOAD_SECRET=
   NEXT_PUBLIC_SERVER_URL=http://localhost:3001
   ```

6. Run Payload on port `3001`, leaving Vite on port `5173`.
7. Configure Payload CORS to allow:
   - `http://localhost:5173`
   - the production frontend domain

## Phase 4: Define Payload Collections

Payload needs three collections. Only `previous-sponsors` is website content;
the other two support CMS administration and uploads.

### Users

Use the standard Payload authentication collection:

```text
users
```

Only authenticated users can create, update, or delete content.

### Media

Create an upload collection:

```text
media
```

Requirements:

- Accept image uploads only.
- Store alt text for accessibility.
- Allow public reads so the frontend can display logos.
- Require an authenticated user for writes.

### Previous Sponsors

Create:

```text
previous-sponsors
```

Fields:

| Field | Payload type | Rules |
| --- | --- | --- |
| `name` | `text` | Required |
| `logo` | `upload` referencing `media` | Required |
| `url` | `text` | Required; validate as an `http` or `https` URL |

Access rules:

- Public users can read previous sponsors.
- Authenticated CMS users can create, update, and delete previous sponsors.

The public REST endpoint will be:

```text
GET http://localhost:3001/api/previous-sponsors?depth=1
```

Using `depth=1` returns the populated logo data, including the image URL.

## Phase 5: Connect The Vite Frontend

1. Add the CMS URL to `packages/frontend/.env.example`:

   ```text
   VITE_CMS_URL=http://localhost:3001
   ```

2. Add a small typed CMS client in the frontend.
3. Fetch:

   ```text
   GET ${VITE_CMS_URL}/api/previous-sponsors?depth=1
   ```

4. Render each sponsor's `name`, `url`, and `logo.url`.
5. Add loading, empty, and error states.
6. Keep the current hard-coded sponsor data until the CMS-backed component is
   ready, then remove the duplicated content.

## Phase 6: Configure Production Logo Storage

Local file uploads are suitable for development only. Before deploying the CMS
to Fly.io:

1. Create an S3-compatible bucket using Tigris or Cloudflare R2.
2. Install Payload's official S3 storage adapter:

   ```text
   @payloadcms/storage-s3
   ```

3. Configure the adapter for the `media` collection.
4. Add production secrets:

   ```text
   S3_BUCKET
   S3_ENDPOINT
   S3_ACCESS_KEY_ID
   S3_SECRET_ACCESS_KEY
   S3_REGION
   ```

5. Upload a logo in a staging environment and verify that it remains available
   after the Payload app restarts.

## Phase 7: Deploy Payload Separately

Deploy Payload as a second Fly app so it can run independently from the public
frontend:

```text
medrevue          # Public Vite and nginx website
medrevue-cms      # Payload admin UI and REST API
```

1. Add `Dockerfile.cms`.
2. Add `fly.cms.toml`.
3. Use a hosted MongoDB deployment such as MongoDB Atlas for production.
4. Add Fly secrets:

   ```text
   DATABASE_URL
   PAYLOAD_SECRET
   S3_BUCKET
   S3_ENDPOINT
   S3_ACCESS_KEY_ID
   S3_SECRET_ACCESS_KEY
   S3_REGION
   ```

5. Deploy the CMS.
6. Create the first admin user.
7. Add sponsor records through the Payload admin UI.
8. Update the frontend production environment to use the deployed CMS URL.

## Acceptance Checklist

- [ ] `yarn.lock` is removed.
- [ ] `README.md` reflects the nginx and npm deployment.
- [ ] The legacy ticketing backend is clearly marked as archived.
- [ ] `docker build -t medrevue .` builds the public website image.
- [ ] `docker run --rm -p 3000:3000 medrevue` serves the public website.
- [ ] Direct navigation to `/sponsors` works through nginx.
- [ ] `docker compose up -d mongo` starts local MongoDB.
- [ ] `npm run dev:cms` opens the Payload admin panel.
- [ ] An admin can upload a logo and create a previous sponsor.
- [ ] `GET /api/previous-sponsors?depth=1` returns sponsor and logo data.
- [ ] The Vite frontend displays CMS-managed sponsors.
- [ ] Production logos remain available after the Payload app restarts.

## References

- [Payload MongoDB adapter](https://payloadcms.com/docs/database/mongodb)
- [Payload upload collections](https://payloadcms.com/docs/upload/overview)
- [Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)
- [Fly.io static site deployment](https://fly.io/docs/languages-and-frameworks/static/)
