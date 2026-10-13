#!/usr/bin/env python3
"""Fail-closed checks for SDLC files in Docker contexts and runtime images.

The image check does NOT run the application: docker create/export, then remove.
This is an artifact audit, not a deployment operation or a security sandbox.
"""
from __future__ import annotations

import argparse
import io
import pathlib
import posixpath
import re
import resource
import shlex
import subprocess
import sys
import tarfile
import tempfile
from typing import BinaryIO

ROOT = pathlib.Path(__file__).resolve().parents[1]
MAX_FINDINGS = 50
MAX_EXPORT_BYTES = 2 * 1024 * 1024 * 1024
CREATE_TIMEOUT = 30
EXPORT_TIMEOUT = 180
REMOVE_TIMEOUT = 30

# These names have control-plane meaning even beneath a public/ or .next/ tree.
FORBIDDEN_FILES = frozenset({
    "AGENTS.md", "CLAUDE.md", "FILE_REGISTRY.yml", "PROJECT_MAP.md",
    "PRODUCT.md", "opencode.json", ".agentsignore", ".codexignore",
})
FORBIDDEN_DIRS = frozenset({
    ".git", ".github", ".agent", ".agents", ".claude", ".codex", ".opencode",
    ".githooks", "governance", "docs", "runtimes", "framework", "template",
    "integrations", "memory_bank", "00_strategy", "01_brand", "02_website",
    "03_leads", "04_facebook", "05_ai", "06_seo", "07_ops",
})
# scripts/ is not a universal forbidden name: real sites may serve scripts.
# Repository-owned SDLC helper source files must not appear in any image.
FORBIDDEN_SCRIPT_PREFIXES = (
    "sdlc-", "agent-runtime-", "subagent_", "run-independent-verifier",
    "run-os-isolated-verifier", "provision-os-isolated-verifier",
    "materialize-candidate-evidence", "repair-lifecycle",
    "process_feedback", "aggregate-process-feedback",
)
PROJECT_NAMES = frozenset({"web", "admin", "showcase"})
DEPENDENCY_PREFIXES = (
    ("app", "node_modules"),
    ("app", "web", "node_modules"),
    ("app", "admin", "node_modules"),
    ("app", "showcase", "node_modules"),
    ("usr", "local", "lib", "node_modules"),
    ("usr", "lib", "node_modules"),
)
# Any new Dockerfile context source or stage-copy instruction must be reviewed.
EXPECTED_COPIES = {
    "Dockerfile": (
        "COPY web/package*.json ./",
        "COPY --from=deps /app/web/node_modules ./node_modules",
        "COPY web/ ./",
        "COPY --from=build --chown=node:node /app/web/.next/standalone ./",
        "COPY --from=build --chown=node:node /app/web/.next/static ./.next/static",
        "COPY --from=build --chown=node:node /app/web/public ./public",
    ),
    "Dockerfile.admin": (
        "COPY admin/package*.json ./",
        "COPY --from=deps /app/admin/node_modules ./node_modules",
        "COPY admin/ ./",
        "COPY --from=build --chown=node:node /app/admin/.next/standalone ./",
        "COPY --from=build --chown=node:node /app/admin/.next/static ./.next/static",
    ),
    "Dockerfile.showcase": (
        "COPY showcase/package*.json ./",
        "COPY --from=deps /app/showcase/node_modules ./node_modules",
        "COPY showcase/ ./",
        "COPY --from=build --chown=node:node /app/showcase/.next/standalone ./",
        "COPY --from=build --chown=node:node /app/showcase/.next/static ./.next/static",
        "COPY --from=build --chown=node:node /app/showcase/public ./public",
    ),
}
VPS_RUNTIME_TRANSFER = (
    "docker-compose.vps.yml", "deploy.sh", "nginx.proxy.conf",
)
STANDALONE_SERVERS = {
    ("app", "server.js"),
    ("app", "web", "server.js"),
    ("app", "admin", "server.js"),
    ("app", "showcase", "server.js"),
}


def normalize_path(name: str) -> tuple[str, ...]:
    """Normalize a Docker export TAR member without permitting path traversal."""
    if not name or "\x00" in name or "\\" in name or name.startswith("/"):
        raise ValueError(f"unsafe TAR member path: {name!r}")
    while name.startswith("./"):
        name = name[2:]
    name = name.rstrip("/")
    if name in {"", "."}:
        return ()
    parts = name.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        raise ValueError(f"non-canonical TAR member path: {name!r}")
    return tuple(parts)


def dependency_owned(parts: tuple[str, ...]) -> bool:
    return any(parts[:len(prefix)] == prefix for prefix in DEPENDENCY_PREFIXES)


def forbidden_parts(parts: tuple[str, ...]) -> str | None:
    if not parts or dependency_owned(parts):
        return None
    if any(part in FORBIDDEN_FILES for part in parts):
        return "repository/agent control-plane file"
    if any(part in FORBIDDEN_DIRS for part in parts):
        return "repository/agent control-plane directory"
    if parts[0] == "app" and len(parts) >= 3:
        roots = parts[1:]
        if roots[0] in PROJECT_NAMES:
            roots = roots[1:]
        if roots and roots[0] == "scripts":
            return "first-party scripts directory"
    if any(part.startswith(FORBIDDEN_SCRIPT_PREFIXES) for part in parts):
        return "SDLC helper script"
    return None


def forbidden_path(name: str) -> str | None:
    return forbidden_parts(normalize_path(name))


def link_target_parts(parts: tuple[str, ...], item: tarfile.TarInfo) -> tuple[str, ...]:
    name = item.linkname
    if not name or "\x00" in name or "\\" in name:
        raise ValueError(f"unsafe TAR link target: {name!r}")
    if item.issym():
        # Symbolic links resolve relative to their parent, or filesystem root.
        combined = name.lstrip("/") if name.startswith("/") else posixpath.join(
            *parts[:-1], name
        )
    else:
        # A TAR hard link's linkname is relative to the archive root.
        combined = name.lstrip("/")
    normalized = posixpath.normpath(combined)
    if normalized == ".." or normalized.startswith("../"):
        raise ValueError(f"TAR link escapes filesystem root: {name!r}")
    return normalize_path(normalized)


def inspect_tar(stream: BinaryIO) -> tuple[list[str], bool]:
    """Stream and inspect whole exported filesystem; keep only bounded findings."""
    findings: list[str] = []
    seen_server = False

    def report(message: str) -> None:
        if len(findings) < MAX_FINDINGS:
            findings.append(message)

    with tarfile.open(fileobj=stream, mode="r|*") as archive:
        for item in archive:
            try:
                parts = normalize_path(item.name)
                if not parts:
                    continue
                reason = forbidden_parts(parts)
                if reason:
                    report(f"{item.name}: {reason}")

                if parts in STANDALONE_SERVERS:
                    if not item.isreg():
                        report(f"{item.name}: standalone server.js must be a regular file")
                    else:
                        seen_server = True

                if parts[0] == "app" and not dependency_owned(parts):
                    if not (item.isreg() or item.isdir() or item.issym() or item.islnk()):
                        report(f"{item.name}: unsupported first-party TAR member type")

                if item.issym() or item.islnk():
                    target = link_target_parts(parts, item)
                    target_reason = forbidden_parts(target)
                    if target_reason:
                        report(f"{item.name}: link targets forbidden {target_reason} ({item.linkname})")
                    if parts[0] == "app" and not dependency_owned(parts):
                        if target and target[0] != "app":
                            report(f"{item.name}: first-party link escapes /app ({item.linkname})")
            except ValueError as error:
                report(f"{item.name}: {error}")
    return findings, seen_server


def _cap_export_file() -> None:
    """Linux CI: prevent docker export from exhausting runner scratch disk."""
    resource.setrlimit(resource.RLIMIT_FSIZE, (MAX_EXPORT_BYTES, MAX_EXPORT_BYTES))


def verify_image(image: str) -> None:
    if not image or image.startswith("-"):
        raise ValueError("image must be a nonempty Docker image reference")

    created = subprocess.run(
        ["docker", "create", image], capture_output=True, text=True,
        check=True, timeout=CREATE_TIMEOUT,
    )
    container = created.stdout.strip()
    if not re.fullmatch(r"[0-9a-f]{64}", container):
        raise RuntimeError("docker create returned an invalid container ID")

    try:
        # A bounded disk-backed file avoids simultaneously piping large stdout
        # and stderr. subprocess.run kills/reaps an export on timeout.
        with tempfile.TemporaryFile() as exported:
            subprocess.run(
                ["docker", "export", container], stdout=exported,
                stderr=subprocess.PIPE, check=True, timeout=EXPORT_TIMEOUT,
                preexec_fn=_cap_export_file,
            )
            exported.seek(0)
            findings, seen_server = inspect_tar(exported)
        if findings:
            raise RuntimeError("forbidden runtime contents:\n" + "\n".join(findings))
        if not seen_server:
            raise RuntimeError("no regular Next.js standalone server.js under /app")
        print(f"PASS runtime image {image}: no disallowed SDLC artifacts detected")
    finally:
        # Even a failed inspection cannot leave inspection containers running.
        subprocess.run(
            ["docker", "rm", "-f", container], capture_output=True,
            check=True, timeout=REMOVE_TIMEOUT,
        )


def docker_instructions(filename: str) -> list[str]:
    logical: list[str] = []
    buf = ""
    for original in (ROOT / filename).read_text(encoding="utf-8").splitlines():
        line = original.strip()
        if not line or (line.startswith("#") and not buf):
            continue
        if line.endswith("\\"):
            buf += line[:-1].rstrip() + " "
            continue
        logical.append(buf + line)
        buf = ""
    if buf:
        raise RuntimeError(f"{filename}: unterminated Dockerfile instruction")
    return logical


def verify_repo_contract() -> None:
    """Exact allowed Dockerfile COPY statements and managed VPS SCP boundary."""
    for filename, expected in EXPECTED_COPIES.items():
        observed: list[str] = []
        instructions = docker_instructions(filename)
        for line in instructions:
            tokens = shlex.split(line)
            if not tokens:
                continue
            instruction = tokens[0].upper()
            if instruction in {"ADD", "ONBUILD"}:
                raise RuntimeError(f"{filename}: unsupported context/stage operation: {line}")
            if instruction == "RUN" and re.search(r"--mount(?:=|\s)", line):
                raise RuntimeError(f"{filename}: unreviewed RUN bind mount: {line}")
            if instruction == "COPY":
                # Match the entire normalized instruction. Reject external stages,
                # added options, JSON COPY, extra sources and unsupported forms.
                observed.append(" ".join(tokens))
        if observed != list(expected):
            raise RuntimeError(
                f"{filename}: COPY contract drift: expected {expected!r}, got {observed!r}"
            )

    deploy = (ROOT / ".github/workflows/deploy-vps.yml").read_text(encoding="utf-8")
    sources = re.findall(r'^\s*source:\s*"([^"]+)"\s*$', deploy, flags=re.MULTILINE)
    if len(sources) != 1 or tuple(x.strip() for x in sources[0].split(",")) != VPS_RUNTIME_TRANSFER:
        raise RuntimeError(f"VPS runtime SCP allowlist changed: {sources!r}")
    print("PASS source contract: Docker COPY and VPS SCP allowlists unchanged")


def synthetic_tar(*members: tuple[str, str, str]) -> io.BytesIO:
    result = io.BytesIO()
    with tarfile.open(fileobj=result, mode="w") as archive:
        for name, kind, target in members:
            item = tarfile.TarInfo(name)
            item.size = 0
            if kind == "regular":
                item.type = tarfile.REGTYPE
            elif kind == "symlink":
                item.type = tarfile.SYMTYPE
                item.linkname = target
            elif kind == "directory":
                item.type = tarfile.DIRTYPE
            else:
                raise AssertionError(f"unsupported test member type {kind}")
            archive.addfile(item)
    result.seek(0)
    return result


def self_test() -> None:
    bad_paths = (
        "app/AGENTS.md", "app/public/.agent/state.json",
        "app/public/.codex/hooks.json", "app/public/FILE_REGISTRY.yml",
        "app/public/node_modules/AGENTS.md",
        "app/.agent/node_modules/state.json", "app/web/governance/authority.md",
        "workspace/.agent/state.json", "srv/project/integrations/mcp/README.md",
        "app/scripts/sdlc-v1-bridge.py",
    )
    okay_paths = (
        "app/server.js", "app/public/logo.svg", "app/.next/server/page.js",
        "app/node_modules/vendor/AGENTS.md", "usr/local/lib/node_modules/npm/AGENTS.md",
        "usr/share/doc/package/README.md",
    )
    for name in bad_paths:
        if forbidden_path(name) is None:
            raise AssertionError(f"missed SDLC control-plane path: {name}")
    for name in okay_paths:
        if forbidden_path(name) is not None:
            raise AssertionError(f"legitimate path rejected: {name}")
    for name in ("app/../docs/file", "/app/.agent/x", "app//.agent/file"):
        try:
            forbidden_path(name)
        except ValueError:
            pass
        else:
            raise AssertionError(f"noncanonical TAR path accepted: {name}")

    clean, server = inspect_tar(synthetic_tar(
        ("app/server.js", "regular", ""),
        ("app/public/logo.svg", "regular", ""),
        ("app/node_modules/vendor/AGENTS.md", "regular", ""),
    ))
    if clean or not server:
        raise AssertionError(f"false positive in clean TAR: {clean}")

    forbidden, server = inspect_tar(synthetic_tar(
        ("app/server.js", "regular", ""),
        *((name, "regular", "") for name in bad_paths),
        ("app/public/config-link", "symlink", "/app/.agent/state.json"),
        ("app/public/traversal", "symlink", "../../../.agent/state.json"),
    ))
    if not server or len(forbidden) < len(bad_paths) + 2:
        raise AssertionError(f"false negative in forbidden TAR: {forbidden}")
    wrong_type, server = inspect_tar(synthetic_tar(
        ("app/server.js", "symlink", "/app/actual.js"),
    ))
    if server or not wrong_type:
        raise AssertionError("nonregular standalone server passed")
    missing, server = inspect_tar(synthetic_tar(("app/public/logo.svg", "regular", "")))
    if server or missing:
        raise AssertionError("missing standalone fixture incorrect")
    print("PASS path normalization, first-party classification and TAR negative fixtures")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    selected = parser.add_mutually_exclusive_group(required=True)
    selected.add_argument("--self-test", action="store_true")
    selected.add_argument("--check-repo-contract", action="store_true")
    selected.add_argument("--image", help="Already-built local image; never published")
    args = parser.parse_args()
    try:
        if args.self_test:
            self_test()
        elif args.check_repo_contract:
            verify_repo_contract()
        else:
            verify_image(args.image)
    except (
        OSError, subprocess.CalledProcessError, subprocess.TimeoutExpired,
        RuntimeError, ValueError, tarfile.TarError, EOFError, AssertionError,
    ) as error:
        print(f"FAIL deployment artifact isolation: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
