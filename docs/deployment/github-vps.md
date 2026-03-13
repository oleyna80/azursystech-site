# GitHub -> VPS Deployment (AzurSysTech)

## 1) Pre-publish checks (local)

```bash
cd /home/dmitrii/azursystech/web
npm ci
npm run check:ci
```

## 2) Push to GitHub

```bash
cd /home/dmitrii/azursystech
git add .
git commit -m "Prepare release"
git push origin main
```

Pipeline order:
- `CI` checks lint/types/build for `web/`
- `Docker Publish` builds and pushes image to GHCR with immutable tag `sha-<commit>`
- `Deploy to VPS` deploys the same immutable tag to VPS

## 3) Prepare VPS (one-time)

Install on VPS:
- Docker Engine
- Docker Compose plugin

Create app directory:

```bash
sudo mkdir -p /home/dmitrii/projects/azursystech-site
sudo chown -R $USER:$USER /home/dmitrii/projects/azursystech-site
```

Copy runtime files and create `.env`:

```bash
cp docker-compose.vps.yml /home/dmitrii/projects/azursystech-site/
cp nginx.proxy.conf /home/dmitrii/projects/azursystech-site/
cp .env.vps.example /home/dmitrii/projects/azursystech-site/.env
```

Update `/home/dmitrii/projects/azursystech-site/.env`:
- `IMAGE_REPO=ghcr.io/<owner>/<repo>`
- `IMAGE_TAG=sha-<commit-sha>`
- `DEEPSEEK_API_KEY=...`
- `DEEPSEEK_BASE_URL=https://api.deepseek.com`
- `ALLOWED_ORIGINS=https://azursystech.fr,https://www.azursystech.fr`

Important:
- do not commit real runtime secrets into the repository
- rotate any AI key that was ever saved into a tracked file by mistake

## 4) Configure GitHub Secrets

Required by `Deploy to VPS` workflow:
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT` (optional, default `22`)
- `VPS_APP_DIR` (example: `/home/dmitrii/projects/azursystech-site`)
- `GHCR_USERNAME`
- `GHCR_TOKEN` (`read:packages`)

Required on VPS `.env` for live AI intake:
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL` (optional if default is kept)
- `ALLOWED_ORIGINS`

Optional for monitoring:
- `UPTIME_ALERT_WEBHOOK`
- repository variable `SITE_BASE_URL` (default `https://azursystech.fr`)

## 5) Deploy

Automatic mode:
- after successful `CI -> Docker Publish` chain on `main`

Manual mode:

```bash
# image_tag must be immutable sha-* (latest is forbidden)
gh workflow run "Deploy to VPS" -f image_tag="sha-<40-char-commit>"
```

## 6) Verify on VPS

```bash
cd /home/dmitrii/projects/azursystech-site
docker compose -f docker-compose.vps.yml ps
docker compose -f docker-compose.vps.yml logs -f --tail=100
docker exec azursystech-app wget -qO- http://127.0.0.1:3000/health
docker exec azursystech-app /bin/sh -lc 'echo "$DEEPSEEK_BASE_URL"'
```

## 7) Runtime contract

- `app`: Next.js standalone runtime on `:3000`, health endpoint `GET /health`
- `web`: Nginx reverse proxy using `nginx.proxy.conf`, forwards traffic to `app:3000`
- `npm_default` external network is expected for Nginx Proxy Manager integration

## 8) Rollback

Re-run deploy workflow with previous known-good immutable tag:

```bash
gh workflow run "Deploy to VPS" -f image_tag="sha-<previous-good-commit>"
```
