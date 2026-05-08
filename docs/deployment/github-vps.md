# WSL Registry -> VPS Deployment (AzurSysTech)

## Decision

Production deploy must not build the application on the VPS.

The VPS is a runtime node only:
- pull an immutable Docker image from a private registry;
- restart `app` and `web`;
- verify health;
- roll back to the previous image tag if verification fails.

GitHub repository usage:
- public/portfolio source only;
- not the production deploy source;
- no GitHub Actions deploy requirement.

Recommended registry:
- GHCR private package: `ghcr.io/oleyna80/azursystech-app`
- another private Docker registry is acceptable if the same immutable-tag contract is kept.

## 1) Pre-release checks on WSL

```bash
cd /home/dmitrii/azursystech/web
npm ci
npm run check:ci
```

`npm run check:ci` already includes lint, typecheck, build, and high-severity audit.

## 2) Build and push image from WSL

Login to the private registry before pushing:

```bash
docker login ghcr.io
```

Build and push:

```bash
cd /home/dmitrii/azursystech
IMAGE_REPO=ghcr.io/oleyna80/azursystech-app ./scripts/build-push-image.sh
```

The script emits the full immutable image reference, for example:

```text
ghcr.io/oleyna80/azursystech-app:sha-55f532581fdf-20260508T140000Z
```

Rules:
- build on WSL, not on the VPS;
- use `linux/amd64` unless the VPS architecture changes;
- never deploy `latest`;
- keep Docker image tags immutable.

## 3) Prepare VPS (one-time)

Install on VPS:
- Docker Engine
- Docker Compose plugin

Login to the private registry:

```bash
docker login ghcr.io
```

Create a runtime-only app directory:

```bash
mkdir -p /home/dmitrii/apps/azursystech
```

Runtime files required in that directory:
- `docker-compose.vps.yml`
- `nginx.proxy.conf`
- `deploy.sh`
- `.env`
- `scripts/backup-env.sh`
- `scripts/postgres-backup.sh`
- `scripts/postgres-restore.sh`
- `scripts/postgres-ssl-rollout.sh`

Current migration note:
- `/home/dmitrii/projects/azursystech-site` still exists as the old git-backed runtime directory.
- Keep it until the first registry-pull deploy and rollback test pass.
- After that, production should use a runtime-only directory.

## 4) VPS `.env` contract

Create `.env` from `.env.vps.example` and set production values.

Required image setting:

```bash
APP_IMAGE=ghcr.io/oleyna80/azursystech-app:sha-<commit>-<timestamp>
```

Required runtime settings:
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
- do not copy `.env` into GitHub
- rotate any AI key that was ever saved into a tracked file by mistake

Production integration guard:
- if `NODE_ENV=production` and `AZURSYSTECH_CONTACT_SUBMIT_ENABLED=true`, `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS` must be explicitly set and non-empty or outbound dispatch is blocked as misconfigured.

Optional for monitoring:
- `UPTIME_ALERT_WEBHOOK`

## 5) Deploy on VPS

Run from the VPS runtime directory:

```bash
cd /home/dmitrii/apps/azursystech
./deploy.sh ghcr.io/oleyna80/azursystech-app:sha-<commit>-<timestamp>
```

The deploy script:
- rejects `latest`;
- writes `APP_IMAGE` to `.env`;
- stores the previous image reference in `.deploy/previous-app-image`;
- runs `docker compose pull app web`;
- runs `docker compose up -d --remove-orphans app web`;
- checks internal app health and public health;
- rolls back to the previous image if health verification fails.

Manual deploy without the script:

```bash
cd /home/dmitrii/apps/azursystech
APP_IMAGE=ghcr.io/oleyna80/azursystech-app:sha-<commit>-<timestamp>
docker compose -f docker-compose.vps.yml pull app web
docker compose -f docker-compose.vps.yml up -d app web
```

## 6) Verify on VPS

```bash
cd /home/dmitrii/apps/azursystech
docker compose -f docker-compose.vps.yml ps
docker compose -f docker-compose.vps.yml logs -f --tail=100
docker exec azursystech-app wget -qO- http://127.0.0.1:3000/health
docker exec azursystech-app /bin/sh -lc 'echo "$DEEPSEEK_BASE_URL"'
docker exec azursystech-app /bin/sh -lc 'echo "$INTAKE_STORAGE_MODE"'
docker exec azursystech-app /bin/sh -lc 'if [ -n "$DATABASE_URL" ]; then echo "DATABASE_URL is set"; else echo "DATABASE_URL is missing"; fi'
docker compose -f docker-compose.vps.yml exec -T postgres pg_isready
curl -sSI https://azursystech.fr/health
```

## 6.1) DATABASE_SSL_MODE rollout (safe apply + fallback)

Before switching to `DATABASE_SSL_MODE=require` or `verify-full`, PostgreSQL must report SSL enabled (`SHOW ssl; -> on`).  
If SSL is not enabled on the DB side, rollout must not proceed.

Dry-run (precheck only, no changes):

```bash
cd /home/dmitrii/apps/azursystech
./scripts/postgres-ssl-rollout.sh --mode require
```

Apply with automatic rollback on failed DB probe:

```bash
cd /home/dmitrii/apps/azursystech
./scripts/postgres-ssl-rollout.sh --mode require --apply
```

Optional strict cert validation mode:

```bash
cd /home/dmitrii/apps/azursystech
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

Preferred rollback:

```bash
cd /home/dmitrii/apps/azursystech
PREVIOUS_IMAGE="$(cat .deploy/previous-app-image)"
./deploy.sh "$PREVIOUS_IMAGE"
```

Manual rollback:

```bash
cd /home/dmitrii/apps/azursystech
APP_IMAGE=ghcr.io/oleyna80/azursystech-app:sha-<known-good>
docker compose -f docker-compose.vps.yml pull app || true
docker compose -f docker-compose.vps.yml up -d app web
curl -sSI https://azursystech.fr/health
```

Do not run `docker image prune -a` unless rollback images are no longer needed.

## 9) CPU and resource policy

- Never build the Next.js app on the VPS.
- Do not run `docker compose build` on the VPS for production.
- VPS deploy may pull and unpack image layers only.
- Keep at least one previous app image locally for rollback.
- Prefer targeted cleanup over broad prune commands.
