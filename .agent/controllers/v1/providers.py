"""Concrete trusted external platform fact providers."""

from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from urllib.parse import quote

from .errors import StopAndPreserve
from .installation import InstallationConfig


@dataclass(frozen=True, slots=True)
class GitHubCliBranchProtectionResolver:
    config: InstallationConfig

    def __call__(self, remote: str, branch: str) -> bool:
        if remote != self.config.remote:
            raise StopAndPreserve("branch-protection request used untrusted remote")
        if not isinstance(branch, str) or not branch:
            raise StopAndPreserve("branch-protection request is missing branch")
        endpoint = (
            f"repos/{self.config.repository}/branches/"
            f"{quote(branch, safe='')}"
        )
        try:
            result = subprocess.run(
                ["gh", "api", endpoint],
                check=True,
                capture_output=True,
                text=True,
                timeout=10,
            )
        except (OSError, subprocess.SubprocessError) as exc:
            raise StopAndPreserve(
                "trusted GitHub branch-protection lookup failed"
            ) from exc
        try:
            payload = json.loads(result.stdout)
        except json.JSONDecodeError as exc:
            raise StopAndPreserve(
                "trusted GitHub branch-protection response is invalid"
            ) from exc
        if not isinstance(payload, dict) or type(payload.get("protected")) is not bool:
            raise StopAndPreserve(
                "trusted GitHub branch-protection status is ambiguous"
            )
        return payload["protected"]
