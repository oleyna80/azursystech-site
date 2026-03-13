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
- `Deploy to VPS` connects over SSH, updates repo checkout on VPS, and rebuilds containers locally

## 3) Prepare VPS (one-time)

Install on VPS:
- Docker Engine
- Docker Compose plugin

Create app directory and clone the repository:

```bash
sudo mkdir -p /home/dmitrii/projects/azursystech-site
sudo chown -R $USER:$USER /home/dmitrii/projects/azursystech-site
git clone git@github.com:oleyna80/azursystech-site.git /home/dmitrii/projects/azursystech-site
cp /home/dmitrii/projects/azursystech-site/.env.vps.example /home/dmitrii/projects/azursystech-site/.env
```

Update `/home/dmitrii/projects/azursystech-site/.env`:
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

Required on VPS `.env` for live AI intake:
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL` (optional if default is kept)
- `ALLOWED_ORIGINS`

Optional for monitoring:
- `UPTIME_ALERT_WEBHOOK`
- repository variable `SITE_BASE_URL` (default `https://azursystech.fr`)

## 5) Deploy

Automatic mode:
- after successful `CI` on `main`

Manual mode:

```bash
gh workflow run "Deploy to VPS"
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

Rollback is source-based, not image-tag-based. Revert the repository to a known-good commit and redeploy:

```bash
git revert <bad-commit>
git push origin main
```
