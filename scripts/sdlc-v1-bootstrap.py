#!/usr/bin/env python3
"""Owner/bootstrap helper for replacement controller activation."""

from __future__ import annotations

import argparse
import os
import stat
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".agent"))

from controllers.v1 import gitfacts
from controllers.v1.errors import ControllerError, StopAndPreserve
from controllers.v1.installation import load, write_bootstrap_config


HOOKS = ("pre-commit", "commit-msg", "pre-push")


def _root(value: Path) -> Path:
    return gitfacts.worktree_root(value)


def _hook_path(root: Path, name: str) -> Path:
    return root / ".githooks" / name


def _validate_hooks(root: Path) -> None:
    for name in HOOKS:
        path = _hook_path(root, name)
        try:
            metadata = path.stat()
        except OSError as exc:
            raise StopAndPreserve(f"required Git hook is missing: {name}") from exc
        if not stat.S_ISREG(metadata.st_mode) or not os.access(path, os.X_OK):
            raise StopAndPreserve(f"required Git hook is not executable: {name}")


def install(root: Path, repository: str, registry_path: Path) -> None:
    root = _root(root)
    _validate_hooks(root)
    write_bootstrap_config(
        root,
        repository=repository,
        registry_path=registry_path,
    )
    subprocess.run(
        ["git", "-C", str(root), "config", "core.hooksPath", ".githooks"],
        check=True,
    )
    check(root)


def check(root: Path) -> None:
    root = _root(root)
    _validate_hooks(root)
    config = load(root)
    result = subprocess.run(
        ["git", "-C", str(root), "config", "--get", "core.hooksPath"],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0 or result.stdout.strip() != ".githooks":
        raise StopAndPreserve("core.hooksPath is not installed replacement hooks")
    if not config.registry_path.is_absolute():
        raise StopAndPreserve("trusted registry path is not absolute")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path.cwd())
    sub = parser.add_subparsers(dest="operation", required=True)

    install_parser = sub.add_parser("install")
    install_parser.add_argument("--repository", required=True)
    install_parser.add_argument("--registry-path", type=Path, required=True)
    sub.add_parser("check")

    args = parser.parse_args(argv)
    try:
        if args.operation == "install":
            install(args.root, args.repository, args.registry_path)
        else:
            check(args.root)
        return 0
    except (ControllerError, OSError, ValueError, subprocess.SubprocessError) as exc:
        print(f"STOP: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
