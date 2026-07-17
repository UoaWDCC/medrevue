# Legacy Backend

This folder preserves the old MedRevue backend code for ticket sales, seat
selection, Stripe checkout, QR codes, admin/user endpoints, Redis-backed seat
cache, MongoDB models, seed scripts, and related tests.

The active backend no longer compiles, imports, or deploys this code. It is kept
only as reference material in case ticketing or admin functionality needs to be
restored later.

The live backend is now intentionally small:

- serve the built React frontend
- expose `POST /api/v1/contact`
- send contact form emails through Brevo

To restore any legacy feature, move the relevant files back under
`packages/backend/src`, restore the matching package dependencies, and re-mount
the route in `packages/backend/src/routes/api/api.ts`.
