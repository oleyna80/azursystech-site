"""Deterministic process environment for canonical WB-005 assurance."""

from __future__ import annotations

import os
from collections.abc import Mapping


def isolated_git_environment(
    base: Mapping[str, str] | None = None,
) -> dict[str, str]:
    env = dict(os.environ if base is None else base)

    # Canonical assurance must not inherit user/system Git configuration.
    env["GIT_CONFIG_GLOBAL"] = os.devnull
    env["GIT_CONFIG_SYSTEM"] = os.devnull
    env["GIT_CONFIG_NOSYSTEM"] = "1"

    # Remove environment-injected config entries as well. These are another
    # caller-controlled Git configuration channel and can override global/system
    # isolation.
    env.pop("GIT_CONFIG_COUNT", None)
    env.pop("GIT_CONFIG_PARAMETERS", None)
    for key in tuple(env):
        if key.startswith("GIT_CONFIG_KEY_") or key.startswith("GIT_CONFIG_VALUE_"):
            env.pop(key, None)
    return env


def isolate_process_git_environment() -> None:
    isolated = isolated_git_environment()
    os.environ.clear()
    os.environ.update(isolated)
