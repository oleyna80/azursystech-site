#!/usr/bin/env python3
"""Fail-closed control-plane exclusion checks for deployed Docker artifacts.

No container is started: inspection uses docker create + docker export.
Run --self-test, --check-repo-contract, or --image IMAGE.
"""
from __future__ import annotations

import argparse
import io
import pathlib
import re
import subprocess
import sys
import tarfile
from typing import BinaryIO

ROOT = pathlib.Path(__file__).resolve().parents[1]
PROJECT_SLOTS = frozenset({"web", "admin", "showcase"})
FORBIDDEN_ROOT_DIRS = frozenset({
    ".git", ".github", ".agent", ".agents", ".claude", ".codex", ".opencode",
    ".githooks", "governance", "docs", "runtimes", "framework", "template",
    "memory_bank", "00_strategy", "01_brand", "02_website", "03_leads",
    "04_facebook", "05_ai", "06_seo", "07_ops",
})
FORBIDDEN_ROOT_FILES = frozenset({
    "AGENTS.md", "CLAUDE.md", "FILE_REGISTRY.yml", "PROJECT_MAP.md",
    "PRODUCT.md", "opencode.json", ".agentsignore", ".codexignore",
})
# Native agent entrypoints are never legitimate first-party runtime assets.
FORBIDDEN_ANYWHERE = frozenset({"AGENTS.md", "CLAUDE.md"})
DOCKERFILE_SOURCES = {
    "Dockerfile": {"web/package*.json", "web/"},
    "Dockerfile.admin": {"admin/package*.json", "admin/"},
    "Dockerfile.showcase": {"showcase/package*.json", "showcase/"},
}
VPS_RUNTIME_TRANSFER = (
    "docker-compose.vps.yml", "deploy.sh", "nginx.proxy.conf",
)


def forbidden_path(name: str) -> str | None:
    """Inspect paths under /app, skipping dependency-owned node_modules content."""
    parts = tuple(p for p in name.lstrip("./").lstrip("/").split("/") if p and p != ".")
    if len(parts) < 2 or parts[0] != "app":
        return None
    payload = parts[1:]
    if payload and payload[0] in PROJECT_SLOTS:
        payload = payload[1:]
    if not payload or "node_modules" in payload:
        return None
    if any(p in FORBIDDEN_ANYWHERE for p in payload):
        return "first-party agent instructions"
    if payload[0] in FORBIDDEN_ROOT_DIRS:
        return "SDLC/control-plane directory"
    if payload[0] in FORBIDDEN_ROOT_FILES:
        return "SDLC/control-plane file"
    return None


def inspect_tar(stream: BinaryIO) -> tuple[list[str], bool]:
    violations: list[str] = []
    seen_server = False
    # r|* consumes the stream sequentially and does not unpack the container.
    with tarfile.open(fileobj=stream, mode="r|*") as archive:
        for member in archive:
            name = member.name
            normalized = name.lstrip("./").lstrip("/")
            if normalized in {
                "app/server.js", "app/web/server.js",
                "app/admin/server.js", "app/showcase/server.js",
            }:
                seen_server = True
            reason = forbidden_path(name)
            if reason:
                violations.append(f"{name}: {reason}")
    return violations, seen_server


def verify_image(image: str) -> None:
    if not image or image.startswith("-"):
        raise ValueError("image must be a non-empty trusted Docker image ref")
    created = subprocess.run(
        ["docker", "create", image], capture_output=True, text=True, check=True
    )
    container = created.stdout.strip()
    if not re.fullmatch(r"[0-9a-f]{64}", container):
        raise RuntimeError("docker create did not return a container ID")
    try:
        proc = subprocess.Popen(
            ["docker", "export", container],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        )
        assert proc.stdout is not None
        try:
            violations, seen_server = inspect_tar(proc.stdout)
        except Exception:
            proc.kill()
            proc.wait()
            raise
        finally:
            proc.stdout.close()
        assert proc.stderr is not None
        error = proc.stderr.read().decode("utf-8", errors="replace").strip()
        code = proc.wait()
        if code:
            raise RuntimeError(f"docker export failed (exit {code}): {error}")
        if violations:
            raise RuntimeError("forbidden runtime content:\n" + "\n".join(violations[:50]))
        if not seen_server:
            raise RuntimeError("expected Next.js standalone server.js not found under /app")
        print(f"PASS runtime image {image}: no repository-owned agent/SDLC paths")
    finally:
        subprocess.run(["docker", "rm", "-f", container], capture_output=True, check=True)


def verify_repo_contract() -> None:
    """Guard image COPY sources and VPS transfer allowlist; source-level only."""
    for filename, allowed in DOCKERFILE_SOURCES.items():
        instructions = (ROOT / filename).read_text(encoding="utf-8").splitlines()
        found: set[str] = set()
        for raw in instructions:
            line = raw.strip()
            if not line.startswith("COPY "):
                continue
            tokens = line.split()
            if len(tokens) < 3:
                raise RuntimeError(f"{filename}: malformed COPY instruction")
            if tokens[1].startswith("--from="):
                continue  # Internal stage; runtime image is scanned separately.
            if len(tokens) != 3 or tokens[1] not in allowed:
                raise RuntimeError(f"{filename}: unexpected build-context COPY: {line}")
            found.add(tokens[1])
        if found != allowed:
            raise RuntimeError(f"{filename}: expected sources {sorted(allowed)}, got {sorted(found)}")

    deploy = (ROOT / ".github/workflows/deploy-vps.yml").read_text(encoding="utf-8")
    sources = re.findall(r'^\s*source:\s*"([^"]+)"\s*$', deploy, flags=re.MULTILINE)
    if len(sources) != 1 or tuple(x.strip() for x in sources[0].split(",")) != VPS_RUNTIME_TRANSFER:
        raise RuntimeError(f"VPS runtime SCP allowlist changed: {sources!r}")
    print("PASS repo contract: constrained Docker COPY and VPS SCP runtime allowlist")


def self_test() -> None:
    rejected = (
        "app/AGENTS.md", "./app/CLAUDE.md", "app/.agent/controllers/v1/state.py",
        "app/web/.claude/settings.json", "app/docs/private.md",
        "app/public/AGENTS.md", "app/admin/governance/authority.md",
        "app/showcase/FILE_REGISTRY.yml", "app/.codex/hooks.json",
    )
    accepted = (
        "app/server.js", "app/web/server.js", "app/.next/server/app/page.js",
        "app/public/logo.svg", "app/node_modules/package/docs/README.md",
        "app/node_modules/vendor/AGENTS.md", "etc/passwd",
    )
    for path in rejected:
        if forbidden_path(path) is None:
            raise AssertionError(f"false negative: {path}")
    for path in accepted:
        if forbidden_path(path) is not None:
            raise AssertionError(f"false positive: {path}")

    def synthetic_tar(*names: str) -> io.BytesIO:
        buffer = io.BytesIO()
        with tarfile.open(fileobj=buffer, mode="w") as archive:
            for name in names:
                member = tarfile.TarInfo(name)
                member.size = 0
                archive.addfile(member)
        buffer.seek(0)
        return buffer

    clean, server = inspect_tar(synthetic_tar(
        "./app/server.js", "./app/public/logo.svg",
        "./app/node_modules/some-package/AGENTS.md",
    ))
    if clean or not server:
        raise AssertionError("clean runtime tar fixture must pass with server.js")

    violations, server = inspect_tar(synthetic_tar(
        "./app/server.js", "./app/AGENTS.md",
        "./app/public/docs/AGENTS.md", "./app/.agent/state.json",
    ))
    if len(violations) != 3 or not server:
        raise AssertionError(f"forbidden runtime tar fixture escaped: {violations}")

    _, server = inspect_tar(synthetic_tar("./app/public/logo.svg"))
    if server:
        raise AssertionError("runtime fixture with missing standalone server must fail")
    print("PASS classifier and streamed tar positive/negative fixtures")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--self-test", action="store_true")
    mode.add_argument("--check-repo-contract", action="store_true")
    mode.add_argument("--image", help="Already-built local runtime image ref")
    args = parser.parse_args()
    try:
        if args.self_test:
            self_test()
        elif args.check_repo_contract:
            verify_repo_contract()
        else:
            verify_image(args.image)
    except (OSError, subprocess.CalledProcessError, RuntimeError, ValueError,
            tarfile.TarError, AssertionError) as error:
        print(f"FAIL deployment artifact isolation: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
