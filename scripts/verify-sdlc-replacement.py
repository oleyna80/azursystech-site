#!/usr/bin/env python3
"""Canonical deterministic assurance command for SDLC replacement WB-005/WB-006."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT = ROOT / ".agent"
sys.path.insert(0, str(AGENT))

from assurance.wb5.rehearsal import (
    RehearsalError,
    run_rehearsal,
    verify_candidate_live_wiring,
)
from assurance.wb5.validate import (
    BASELINE_SHA,
    CANONICAL_PATHS,
    AssuranceValidationError,
    validate_source_artifacts,
    wiring_mode,
)


BINDING_PATH = "docs/reports/sdlc-wb005-candidate-binding.json"
SHA_RE = re.compile(r"^[0-9a-f]{40}$")


class VerificationError(Exception):
    pass


def git(*args: str, check: bool = True) -> str:
    result = subprocess.run(
        ["git", "-C", str(ROOT), *args],
        check=False,
        capture_output=True,
        text=True,
    )
    if check and result.returncode != 0:
        raise VerificationError(result.stderr.strip() or "Git command failed")
    return result.stdout.strip()


def tree_blob(revision: str, path: str) -> str | None:
    result = subprocess.run(
        ["git", "-C", str(ROOT), "rev-parse", "--verify", f"{revision}:{path}"],
        check=False,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def resolve_candidate(explicit: str | None) -> tuple[str, dict | None]:
    binding = None
    binding_file = ROOT / BINDING_PATH
    if binding_file.exists():
        binding = json.loads(binding_file.read_text(encoding="utf-8"))
        if not isinstance(binding, dict):
            raise VerificationError("candidate binding must be an object")

    if explicit is not None:
        candidate = git("rev-parse", "--verify", f"{explicit}^{{commit}}")
        if binding is not None and binding.get("replacement_candidate_sha") != candidate:
            raise VerificationError("explicit candidate differs from coordination binding")
    elif binding is not None:
        candidate = str(binding.get("replacement_candidate_sha") or "")
        if SHA_RE.fullmatch(candidate) is None:
            raise VerificationError("coordination binding candidate SHA is invalid")
        candidate = git("rev-parse", "--verify", f"{candidate}^{{commit}}")
    else:
        candidate = git("rev-parse", "--verify", "HEAD^{commit}")

    ancestor = subprocess.run(
        ["git", "-C", str(ROOT), "merge-base", "--is-ancestor", BASELINE_SHA, candidate],
        check=False,
    )
    if ancestor.returncode != 0:
        raise VerificationError("replacement candidate does not descend from WB-4 baseline")

    if binding is not None:
        artifacts = binding.get("artifacts")
        if not isinstance(artifacts, dict):
            raise VerificationError("coordination binding artifacts are missing")
        for key, path in CANONICAL_PATHS.items():
            expected = artifacts.get(key)
            actual = tree_blob(candidate, path)
            if expected != actual:
                raise VerificationError(
                    f"coordination binding differs from candidate tree: {path}"
                )
    for path in CANONICAL_PATHS.values():
        expected = tree_blob(candidate, path)
        current_path = ROOT / path
        if expected is None or not current_path.is_file():
            raise VerificationError(f"candidate artifact is missing: {path}")
        actual = subprocess.run(
            ["git", "-C", str(ROOT), "hash-object", "--", path],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()
        if actual != expected:
            raise VerificationError(
                f"current artifact bytes differ from exact candidate tree: {path}"
            )
    return candidate, binding


def current_wiring_mode(manifest: dict) -> str:
    try:
        return wiring_mode(ROOT, manifest)
    except AssuranceValidationError as exc:
        raise VerificationError(str(exc)) from exc


def run_phase(name: str, command: list[str], env: dict[str, str]) -> None:
    print(f"==> {name}")
    result = subprocess.run(command, cwd=ROOT, env=env, check=False)
    if result.returncode != 0:
        raise VerificationError(f"{name} failed with exit code {result.returncode}")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--replacement-candidate")
    parser.add_argument("--skip-rehearsal", action="store_true")
    args = parser.parse_args(argv)

    try:
        candidate, _binding = resolve_candidate(args.replacement_candidate)
        validate_source_artifacts(ROOT)
        manifest = json.loads(
            (ROOT / CANONICAL_PATHS["manifest"]).read_text(encoding="utf-8")
        )
        verify_candidate_live_wiring(ROOT, candidate, manifest)
        mode = current_wiring_mode(manifest)

        with tempfile.TemporaryDirectory(prefix="wb5-pycache-") as pycache:
            env = os.environ.copy()
            env["PYTHONDONTWRITEBYTECODE"] = "1"
            env["PYTHONPYCACHEPREFIX"] = pycache
            env["PYTHONPATH"] = str(AGENT)
            env["WB5_REPLACEMENT_CANDIDATE_SHA"] = candidate

            run_phase(
                "compile/import",
                [
                    sys.executable,
                    "-m",
                    "compileall",
                    "-q",
                    ".agent/controllers/v1",
                    ".agent/orchestration",
                    ".agent/assurance/wb5",
                    "scripts/sdlc-v1-bridge.py",
                    "scripts/sdlc-v1-bootstrap.py",
                    "scripts/verify-sdlc-replacement.py",
                ],
                env,
            )
            run_phase(
                "controller regressions",
                [
                    sys.executable,
                    "-W",
                    "error::ResourceWarning",
                    "-m",
                    "unittest",
                    "discover",
                    "-s",
                    ".agent/controllers/v1/tests",
                    "-t",
                    ".agent/controllers",
                    "-v",
                ],
                env,
            )
            run_phase(
                "orchestration regressions",
                [
                    sys.executable,
                    "-W",
                    "error::ResourceWarning",
                    "-m",
                    "unittest",
                    "discover",
                    "-s",
                    ".agent/orchestration/tests",
                    "-t",
                    ".agent",
                    "-v",
                ],
                env,
            )
            run_phase(
                "WB-005 artifact regressions",
                [
                    sys.executable,
                    "-W",
                    "error::ResourceWarning",
                    "-m",
                    "unittest",
                    "discover",
                    "-s",
                    ".agent/assurance/wb5/tests",
                    "-t",
                    ".agent",
                    "-v",
                ],
                env,
            )

        summary = None
        if not args.skip_rehearsal:
            print("==> disposable cutover rehearsal")
            summary = run_rehearsal(ROOT, candidate)

        result = {
            "status": "PASS",
            "replacement_candidate_sha": candidate,
            "baseline_sha": BASELINE_SHA,
            "current_wiring_mode": mode,
            "cutover_patch_blob_sha": manifest["patch_blob_sha"],
            "rehearsal": None if summary is None else {
                "cutover_commit": summary.cutover_commit,
                "planning_commit": summary.planning_commit,
                "source_candidate": summary.source_candidate,
                "published_tip": summary.published_tip,
                "terminal_reason": summary.terminal_reason,
            },
        }
        print(json.dumps(result, sort_keys=True))
        return 0
    except (
        VerificationError,
        AssuranceValidationError,
        RehearsalError,
        OSError,
        ValueError,
        json.JSONDecodeError,
    ) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
