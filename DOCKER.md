# Docker Deployment

Self-hosted deployment guide for `mazonhaosher` on your own server.

## Prerequisites

- Docker 24+
- Docker Compose v2

## 1. Clone & configure

```bash
git clone <your-repo-url> mazonhaosher
cd mazonhaosher
```

Create a `.env` file next to `docker-compose.yml`:

```env
VITE_SUPABASE_URL=https://ffhnameizeueevuqvjfi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...   # publishable key, safe to expose
VITE_SUPABASE_PROJECT_ID=ffhnameizeueevuqvjfi
HOST_PORT=8080
```

> These three `VITE_*` vars are **publishable** — they get inlined into the
> client bundle at build time. They are not secrets.

## 2. Build & run

```bash
docker compose build --no-cache
docker compose up -d
```

App is now served at `http://<server-ip>:8080`.

## 3. Update after a new git push

```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```

The `--no-cache` flag guarantees the Vite bundle is rebuilt with the latest
source so users immediately see the new version.

## 4. Reverse proxy (recommended)

Put nginx / Caddy / Traefik in front of the container for TLS and a clean
domain. Example Caddy block:

```caddy
mazonhaosher.com {
    reverse_proxy localhost:8080
}
```

## 5. SPA routing

`nginx.conf` already includes the SPA fallback (`try_files $uri /index.html`),
so deep links like `/admin` and `/auth` work after a hard refresh.

## 6. Cache busting

- `index.html`, `sw.js`, `manifest.webmanifest` → `no-store` (always fresh)
- `/assets/*` → `immutable` for 1 year (filenames are hashed by Vite)

This means a new deploy is picked up on the next page load — no manual cache
clearing required for end users.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Old version still showing | Hard refresh (Ctrl+Shift+R). The service worker may need one extra reload. |
| 404 on `/admin` after refresh | nginx config not loaded — rebuild the image. |
| Blank page, console error about Supabase | `.env` not passed at build time. Re-run `docker compose build --no-cache`. |
| Port 8080 already in use | Change `HOST_PORT` in `.env`. |
