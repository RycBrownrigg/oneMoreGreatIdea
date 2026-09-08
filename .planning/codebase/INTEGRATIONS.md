# External Integrations

**Analysis Date:** 2026-09-08

## APIs & External Services

**Form Submission:**
- formsubmit.co - handles contact form submissions with no backend of its own
  - Configured via `contactFormAction = "https://formsubmit.co/ryc@askryc.mt"` and `contactFormProvider = "formsubmit.co"` in `themes/lumio/src/config/config.toml`
  - Client logic: `themes/lumio/src/lib/utils/FormHandle.ts` (marked `@ts-nocheck`), rendered by `themes/lumio/src/layouts/components/widgets/ContactForm.astro` and `CommentForm.astro`
  - Auth: none (formsubmit.co uses the destination email as the "credential")

**Analytics:**
- Umami (self-hosted or Umami Cloud) - `themes/lumio/public/umami.is.js` is a static script served verbatim; no build-time SDK/package dependency
  - No corresponding env var or config toggle found in `config.toml` — the tracking script's data attributes (site ID) would need to be checked directly in the HTML `<head>` if analytics is active

## Data Storage

**Databases:**
- None — this is a fully static site with no backend datastore

**File Storage:**
- Local filesystem only — content lives in `src/content/`, images in `src/assets/images/` (Astro-processed) and `public/` (unprocessed)

**Caching:**
- None application-level; Astro's own image cache (`node_modules/.astro/`) is a build-time optimization only

## Authentication & Identity

**Auth Provider:**
- None — the site has no login/authenticated areas

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Build/dev console output only (Astro/Vite default); no external log aggregation

## CI/CD & Deployment

**Hosting:**
- Self-managed VPS (135.148.61.99), NOT Netlify or Cloudflare Pages despite `netlify.toml` and `wrangler.toml` being present in `themes/lumio/` (these appear to be unused legacy artifacts from the Lumio theme template)
- Deploy mechanism: `npm run build` (from `themes/lumio/`) produces `dist/`, which is rsynced to the VPS — this is a manual/external process, not part of the Astro project's own tooling

**CI Pipeline:**
- None detected in the repository

## Environment Configuration

**Required env vars:**
- None currently required for a static build; `.env`/`.env.production` are gitignored placeholders (`themes/lumio/.gitignore`) but were not present in the working tree at scan time

**Secrets location:**
- No secrets management system in use; the only "credential"-like values (destination email for formsubmit.co, contact phone/email) are stored in plaintext in `themes/lumio/src/config/config.toml` since they are not sensitive (public contact info)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- Contact/comment form POSTs to `https://formsubmit.co/ryc@askryc.mt` (see `themes/lumio/src/config/config.toml`)

---

*Integration audit: 2026-09-08*
