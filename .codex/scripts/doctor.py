#!/usr/bin/env python3
"""Read-only Codex doctor for schema v3 GitHub-capability projects."""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

SENSITIVE = ("token", "secret", "password", "key", "credential")


def redact(value):
    if isinstance(value, dict):
        return {
            key: (
                "[REDACTED]"
                if any(word in key.lower() for word in SENSITIVE)
                else redact(item)
            )
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [redact(item) for item in value]
    return value


def gate_readiness(gate):
    if not isinstance(gate, dict):
        return {
            "name": "authority_mode",
            "result": "UNVERIFIED",
            "detail": "active gate is not an object",
        }
    if gate.get("schema_version") != 3:
        return {
            "name": "authority_mode",
            "result": "UNVERIFIED",
            "detail": "expected active-work-block schema_version=3",
        }
    if gate.get("authority_mode") != "github_capability":
        return {
            "name": "authority_mode",
            "result": "UNVERIFIED",
            "detail": "expected authority_mode=github_capability",
        }
    return {
        "name": "authority_mode",
        "result": "READY",
        "detail": (
            "project-local gate is cooperative; consequential authority must be "
            "enforced by external GitHub/OS/credential boundaries"
        ),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--state", type=Path, default=Path(".agent/active-work-block.json")
    )
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()

    report = {
        "schema_version": 2,
        "artifact_type": "codex_doctor",
        "authority": "none",
        "state": "UNVERIFIED",
        "live_requested": args.live,
        "checks": [],
    }
    gate = None
    try:
        gate = json.loads(args.state.read_text(encoding="utf-8"))
        report["gate"] = redact(gate)
    except (OSError, json.JSONDecodeError) as exc:
        report["checks"].append(
            {"name": "gate", "result": "UNVERIFIED", "detail": str(exc)}
        )

    if gate is not None:
        report["checks"].append(gate_readiness(gate))

    executable = shutil.which("codex")
    if not args.live:
        report["checks"].append(
            {
                "name": "cli_availability",
                "result": "not_run",
                "detail": "opt in with --live; normal CI never invokes Codex",
            }
        )
    elif not executable:
        report["checks"].append(
            {
                "name": "cli_availability",
                "result": "UNVERIFIED",
                "detail": "codex CLI unavailable",
            }
        )
    else:
        with tempfile.TemporaryDirectory(prefix="codex-doctor-") as temporary:
            repo = Path(temporary)
            subprocess.run(["git", "init", "-q", str(repo)], check=True, timeout=10)
            result = subprocess.run(
                [executable, "--version"],
                cwd=repo,
                text=True,
                capture_output=True,
                check=False,
                timeout=20,
                env={"PATH": str(Path(executable).parent)},
            )
        report["checks"].append(
            {
                "name": "cli_availability",
                "result": "AVAILABLE" if result.returncode == 0 else "UNVERIFIED",
                "detail": "local disposable-repository version check; hooks were not exercised",
            }
        )

    if any(check.get("result") == "READY" for check in report["checks"]):
        report["state"] = "READY"
    print(json.dumps(report, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
