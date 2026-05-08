# GitHub -> VPS Deployment (AzurSysTech)

## 1) Pre-publish checks (local)

```bash
cd /home/dmitrii/azursystech/web
npm ci
npm run check:ci
npm run check:security
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
- `HOSTNAME=0.0.0.0`
- `DEEPSEEK_API_KEY=...`
- `DEEPSEEK_BASE_URL=https://api.deepseek.com`
- `AI_LAUNCH_MODE=limited_live_intake`
- `AI_ALLOW_AUTONOMOUS_OUTBOUND=false`
- `AI_ALLOW_PRICING_COMMITMENTS=false`
- `AI_ALLOW_SCHEDULING_PROMISES=false`
- `ALLOWED_ORIGINS=https://azursystech.fr,https://www.azursystech.fr`
- `POSTGRES_DB=azursystech`
- `POSTGRES_USER=azursystech_app`
- `POSTGRES_PASSWORD=...`
- `INTAKE_STORAGE_MODE=sql_primary` (или `dual`; `legacy` только для fallback)
- `DATABASE_URL=postgresql://azursystech_app:...@postgres:5432/azursystech`
- `DATABASE_SSL_MODE=disable|require|verify-full` (`disable` допустим для текущего internal Docker DB; переходить на `require`/`verify-full` после валидации cert path)

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
- `AI_LAUNCH_MODE=limited_live_intake`
- `AZURSYSTECH_CONTACT_SUBMIT_ENABLED=false|true`
- `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL`
- `AZURSYSTECH_CONTACT_SUBMIT_TOKEN`
- `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS` (required and non-empty in production when submit integration is enabled; comma-separated hostnames)
- `AI_ALLOW_AUTONOMOUS_OUTBOUND=false`
- `AI_ALLOW_PRICING_COMMITMENTS=false`
- `AI_ALLOW_SCHEDULING_PROMISES=false`
- `ALLOWED_ORIGINS`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `INTAKE_STORAGE_MODE=legacy|dual|sql_primary`
- `DATABASE_URL` (required when `INTAKE_STORAGE_MODE` is not `legacy`)
- `DATABASE_SSL_MODE=disable|require|verify-full` (recommended: move from `disable` to `require`/`verify-full` once TLS cert validation is confirmed)

Production integration guard:
- if `NODE_ENV=production` and `AZURSYSTECH_CONTACT_SUBMIT_ENABLED=true`, `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS` must be explicitly set and non-empty or outbound dispatch is blocked as misconfigured.

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
docker exec azursystech-app /bin/sh -lc 'wget -qO- http://$(hostname -i | awk '"'"'{print $1}'"'"'):3000/health'
docker exec azursystech-app /bin/sh -lc 'echo "$DEEPSEEK_BASE_URL"'
docker exec azursystech-app /bin/sh -lc 'echo "$INTAKE_STORAGE_MODE"'
docker exec azursystech-app /bin/sh -lc 'if [ -n "$DATABASE_URL" ]; then echo "DATABASE_URL is set"; else echo "DATABASE_URL is missing"; fi'
docker compose -f docker-compose.vps.yml exec -T postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt intake_*"'
curl -sSI https://azursystech.fr/health
```

## 6.1) DATABASE_SSL_MODE rollout (safe apply + fallback)

Before switching to `DATABASE_SSL_MODE=require` or `verify-full`, PostgreSQL must report SSL enabled (`SHOW ssl; -> on`).  
If SSL is not enabled on the DB side, rollout must not proceed.

Dry-run (precheck only, no changes):

```bash
cd /home/dmitrii/projects/azursystech-site
./scripts/postgres-ssl-rollout.sh --mode require
```

Apply with automatic rollback on failed DB probe:

```bash
cd /home/dmitrii/projects/azursystech-site
./scripts/postgres-ssl-rollout.sh --mode require --apply
```

Optional strict cert validation mode:

```bash
cd /home/dmitrii/projects/azursystech-site
./scripts/postgres-ssl-rollout.sh --mode verify-full --apply
```

Script markers:
- `DB_SSL_ROLLOUT_DRY_RUN ...`
- `DB_SSL_ROLLOUT_APPLIED ...`
- `DB_SSL_ROLLOUT_ROLLBACK ...`
- `DB_SSL_ROLLOUT_OK ...`

## 6.2) Secure PostgreSQL access from WSL via SSH tunnel

`postgres` remains non-public. `docker-compose.vps.yml` binds DB only to VPS loopback:

```yaml
ports:
  - "127.0.0.1:5432:5432"
```

Start tunnel from WSL:

```bash
VPS_HOST=178.156.212.10
VPS_USER=dmitrii
SSH_KEY=/home/dmitrii/.ssh/hardwarelab_deploy
LOCAL_DB_PORT=15432

ssh -fN -i "$SSH_KEY" \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 \
  -L ${LOCAL_DB_PORT}:127.0.0.1:5432 \
  ${VPS_USER}@${VPS_HOST}
```

Or use repo helper:

```bash
cd /home/dmitrii/azursystech
./scripts/vps-db-tunnel.sh start
./scripts/vps-db-tunnel.sh status
./scripts/vps-db-tunnel.sh test
```

Verify from WSL:

```bash
psql -h 127.0.0.1 -p 15432 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "select now();"
```

Stop tunnel:

```bash
pkill -f "ssh .*15432:127.0.0.1:5432.*dmitrii@178.156.212.10"
```

Safety check (should stay closed externally):

```bash
timeout 3 bash -lc '</dev/tcp/178.156.212.10/5432' && echo OPEN || echo CLOSED
```

## 7) Runtime contract

- `app`: Next.js standalone runtime on `:3000`, health endpoint `GET /health`
- `web`: Nginx reverse proxy using `nginx.proxy.conf`, forwards traffic to `app:3000`
- `postgres`: self-hosted PostgreSQL 16 (`azursystech-postgres`), internal-only Docker network access
- `npm_default` external network is expected for Nginx Proxy Manager integration
- intake storage runtime flags:
  - `INTAKE_STORAGE_MODE` (`legacy` / `dual` / `sql_primary`)
  - `DATABASE_URL` (mandatory for `dual` and `sql_primary`)
- backup/restore operational scripts:
  - `scripts/postgres-backup.sh`
  - `scripts/postgres-restore.sh`
- SSL / edge path at launch:
  - `Cloudflare` terminates public edge traffic
  - `Nginx Proxy Manager` handles reverse proxy on the VPS
  - `azursystech-web` serves the app internally on the Docker network
  - public production domain: `https://azursystech.fr`

## 8) Rollback

Rollback is source-based, not image-tag-based. Revert the repository to a known-good commit and redeploy:

```bash
git revert <bad-commit>
git push origin main
```
