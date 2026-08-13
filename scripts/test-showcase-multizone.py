#!/usr/bin/env python3
"""Deterministic source and state-model checks for Showcase multizone."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_SHOWCASE_HOSTS = {"azursystech.fr", "www.azursystech.fr", "localhost", "127.0.0.1"}


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def nginx_upstream(host: str, uri: str) -> str:
    """Model the explicit host map and location precedence in nginx.proxy.conf."""
    if host == "admin.azursystech.fr":
        return "admin:3000"
    if host in PUBLIC_SHOWCASE_HOSTS and (uri == "/demo" or uri.startswith("/demo/") or uri.startswith("/demo-assets/")):
        return "showcase:3000"
    return "app:3000"


def rollback_plan(showcase_exists: bool, showcase_running: bool, admin_exists: bool, admin_running: bool) -> dict[str, bool]:
    """Model the workflow's independent Showcase/admin restoration decisions."""
    return {
        "start_showcase": showcase_exists,
        "stop_showcase": showcase_exists and not showcase_running,
        "remove_showcase": not showcase_exists,
        "start_admin": admin_exists,
        "stop_admin": admin_exists and not admin_running,
        "remove_admin": not admin_exists,
        "require_showcase_health": showcase_running,
        "require_admin_health": admin_running,
    }


def main() -> int:
    next_config = read("showcase/next.config.ts")
    require("output: 'standalone' as const" in next_config, "production standalone output is missing")
    require("static export is intentionally\n  // retired" in next_config, "static-export retirement is not documented")
    require("assetPrefix = process.env.SHOWCASE_ASSET_PREFIX || '/demo-assets'" in next_config, "production asset prefix is not /demo-assets")
    require("path: `${assetPrefix}/_next/image`" in next_config, "next/image endpoint is not namespaced")
    require(not re.search(r"^\s*basePath\s*:", next_config, re.MULTILINE), "Showcase must not configure basePath")

    health = read("showcase/app/demo/health/route.ts")
    require("export function GET" in health and "status: 'ok'" in health, "showcase health route is missing")

    dockerfile = read("Dockerfile.showcase")
    for expected in ("node:22-alpine", ".next/standalone", ".next/static", "/app/showcase/public", "USER node", "/demo/health", "RUN npx next build --webpack"):
        require(expected in dockerfile, f"Dockerfile.showcase missing {expected}")

    ci = read(".github/workflows/ci.yml")
    for expected in (
        "Build Showcase with Webpack",
        "run: npx next build --webpack",
        "showcase-docker-runtime:",
        "github.event_name == 'pull_request'",
        "docker build --file Dockerfile.showcase",
        "docker run --detach --name azursystech-showcase-ci",
        "http://127.0.0.1:3000/demo/health",
    ):
        require(expected in ci, f"PR CI Showcase Docker runtime check missing {expected}")

    compose = read("docker-compose.vps.yml")
    showcase_start = compose.index("  showcase:")
    showcase_end = compose.index("\n  admin:", showcase_start)
    showcase = compose[showcase_start:showcase_end]
    require("SHOWCASE_IMAGE:?SHOWCASE_IMAGE is required" in showcase, "showcase image is not required")
    require("postgres:" not in showcase and "DATABASE_URL" not in showcase, "showcase must be PostgreSQL-free")
    require("showcase:" in compose[compose.index("  web:"):], "web does not wait for showcase")
    require("name: azursystech-site_postgres_data" in compose, "external PostgreSQL volume changed")

    nginx = read("nginx.proxy.conf")
    exact_demo = nginx.index("location = /demo")
    demo_assets = nginx.index("location ^~ /demo-assets/")
    demo = nginx.index("location ^~ /demo/")
    app = nginx.index("location / {")
    require(exact_demo < demo_assets < demo < app, "Nginx multizone location precedence is not deterministic")
    for block_start in (exact_demo, demo_assets, demo):
        block = nginx[block_start:nginx.index("\n        }", block_start)]
        require("proxy_pass http://$showcase_upstream_service;" in block, "Showcase proxy does not preserve URI")
        require("proxy_set_header X-Forwarded-For" in block, "Showcase proxy lost forwarding headers")
    require("map $host $showcase_upstream_service" in nginx, "Showcase host isolation is missing")
    require("admin.azursystech.fr admin:3000" in nginx, "admin routing changed")
    for host, uri, upstream in (
        ("azursystech.fr", "/demo", "showcase:3000"),
        ("azursystech.fr", "/demo/assurance", "showcase:3000"),
        ("azursystech.fr", "/demo-assets/_next/x.js", "showcase:3000"),
        ("admin.azursystech.fr", "/demo", "admin:3000"),
        ("admin.azursystech.fr", "/demo-assets/_next/x.js", "admin:3000"),
        ("azursystech.fr", "/health", "app:3000"),
    ):
        require(nginx_upstream(host, uri) == upstream, f"unexpected upstream for {host}{uri}")

    publish = read(".github/workflows/docker-publish.yml")
    require("Dockerfile.showcase" in publish and "-showcase:${{ steps.meta.outputs.immutable_tag }}" in publish, "Showcase publish tag missing")
    require("^{commit}" in publish and "git rev-parse HEAD" in publish, "annotated tags are not peeled to their commit")
    require("^[0-9a-f]{40}$" in publish and "head_sha=${TARGET_SHA}" in publish, "publish SHA/CI contract weakened")

    deploy = read(".github/workflows/deploy-vps.yml")
    for expected in ("SHOWCASE_IMAGE=\"ghcr.io/${GH_REPOSITORY}-showcase:${IMAGE_TAG}\"", "docker pull \"${SHOWCASE_IMAGE}\"", "previous-showcase-exists.txt", "previous-showcase-running.txt", "previous-showcase-image.txt", "previous-admin-exists.txt", "previous-admin-running.txt", "docker rm -f azursystech-showcase", "docker rm -f azursystech-admin"):
        require(expected in deploy, f"deploy rollback/image contract missing {expected}")
    require("^sha-[0-9a-f]{40}$" in deploy and "flock -n 200" in deploy, "deploy immutable tag or lock contract weakened")

    # Exercise both Showcase states and optional-admin states independently.
    for showcase_exists, showcase_running, admin_exists, admin_running in (
        (False, False, False, False), (False, False, True, False), (False, False, True, True),
        (True, True, False, False), (True, True, True, False), (True, True, True, True),
        (True, False, False, False), (True, False, True, False), (True, False, True, True),
    ):
        plan = rollback_plan(showcase_exists, showcase_running, admin_exists, admin_running)
        require(plan["start_showcase"] is showcase_exists, "rollback Showcase start mismatch")
        require(plan["remove_showcase"] is (not showcase_exists), "first-rollout removal mismatch")
        require(plan["stop_showcase"] is (showcase_exists and not showcase_running), "stopped Showcase restoration mismatch")
        require(plan["start_admin"] is admin_exists, "admin rollback image restore mismatch")
        require(plan["stop_admin"] is (admin_exists and not admin_running), "admin stopped-state mismatch")
        require(plan["remove_admin"] is (not admin_exists), "admin absent-state mismatch")
        require(plan["require_showcase_health"] is showcase_running, "Showcase health requirement mismatch")
        require(plan["require_admin_health"] is admin_running, "admin health requirement mismatch")

    deploy_script = read("deploy.sh")
    require("APP_IMAGE and SHOWCASE_IMAGE must be built from the same exact source SHA" in deploy_script, "runtime image coherence check missing")
    require("previous_showcase_exists" in deploy_script and "docker rm -f azursystech-showcase" in deploy_script, "first rollout rollback branch missing")
    for expected in ("previous_admin_exists", "previous_admin_running", "previous-admin-exists", "cp \"${ENV_FILE}.deploy-${timestamp}.bak\" \"${ENV_FILE}\"", "require_showcase_health"):
        require(expected in deploy_script, f"deploy.sh independent rollback state missing {expected}")
    rollback_web = deploy_script.rindex('docker compose -f "${COMPOSE_FILE}" up -d --no-build --no-deps --force-recreate web')
    showcase_stop = deploy_script.index('docker compose -f "${COMPOSE_FILE}" stop showcase')
    showcase_remove = deploy_script.index('docker rm -f azursystech-showcase')
    require(showcase_stop < rollback_web and showcase_remove < rollback_web, "web rollback can traverse Showcase depends_on before prior state is restored")
    require("/demo/health" in deploy_script and "${HEALTH_URL}" in deploy_script, "health ownership contract missing")
    print("PASS: Showcase multizone source contract and deterministic routing/rollback model")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, ValueError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
