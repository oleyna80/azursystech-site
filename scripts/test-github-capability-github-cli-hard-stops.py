#!/usr/bin/env python3
"""Adversarial GitHub CLI/API Hard Stop fixtures for the normal agent channel."""
from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
HARD_STOP = ROOT / ".agent/hooks/hard_stop_policy.py"
DEFAULT_GATE = ROOT / ".agent/active-work-block.default.json"


def run_hook(cwd: Path, command: str) -> subprocess.CompletedProcess[str]:
    payload = json.dumps(
        {"tool_name": "Bash", "cwd": str(cwd), "tool_input": {"command": command}}
    )
    return subprocess.run(
        [sys.executable, str(HARD_STOP)],
        cwd=cwd,
        input=payload,
        text=True,
        capture_output=True,
        check=False,
        timeout=5,
    )


def denied(result: subprocess.CompletedProcess[str]) -> bool:
    text = (result.stdout + result.stderr).lower()
    return '"permissiondecision": "deny"' in text


def main() -> int:
    failures = 0
    with tempfile.TemporaryDirectory(prefix="azursystech-gh-hard-stop-") as temp:
        cwd = Path(temp)
        subprocess.run(["git", "init", "-q", str(cwd)], check=True, timeout=5)
        subprocess.run(
            ["git", "-C", str(cwd), "config", "user.email", "fixture@example.invalid"],
            check=True,
            timeout=5,
        )
        subprocess.run(
            ["git", "-C", str(cwd), "config", "user.name", "Fixture"],
            check=True,
            timeout=5,
        )
        (cwd / ".agent").mkdir()
        (cwd / ".agent/active-work-block.json").write_text(
            DEFAULT_GATE.read_text(encoding="utf-8"), encoding="utf-8"
        )

        cases = [
            ("gh workflow run deploy-vps.yml", True),
            ("gh run rerun 12345", True),
            ("gh run cancel 12345", True),
            ("gh secret set VPS_KEY", True),
            ("gh variable delete PROD_FLAG", True),
            ("gh pr merge 12 --squash", True),
            ("gh release create v1.2.3", True),
            ("gh api repos/o/r/actions/workflows/deploy-vps.yml/dispatches --method POST", True),
            ("curl -X POST https://api.github.com/repos/o/r/actions/workflows/x/dispatches", True),
            ("gh run view 12345", False),
            ("gh pr view 12", False),
        ]
        for command, expect_deny in cases:
            result = run_hook(cwd, command)
            actual = denied(result)
            if result.returncode != 0 or actual != expect_deny:
                failures += 1
                print(
                    f"FAIL {command!r}: expected_deny={expect_deny} actual={actual} "
                    f"stdout={result.stdout!r} stderr={result.stderr!r}"
                )
            else:
                print(f"PASS {command!r}: {'DENY' if actual else 'ALLOW'}")

    print(f"FAIL={failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
