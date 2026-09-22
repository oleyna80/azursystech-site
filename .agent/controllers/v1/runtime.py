"""Complete shared hard-stop -> adapter -> evaluator decision path."""

from __future__ import annotations

from collections.abc import Mapping

from .adapters import normalize_claude, normalize_codex
from .clock import Clock, utc_now
from .errors import ControllerError
from .hard_stop import evaluate_outer
from .policy import PolicyDecision, compose, evaluate


def decide(
    runtime: str,
    event: Mapping[str, object],
    state: Mapping[str, object],
    *,
    repository_root: str,
    clock: Clock = utc_now,
) -> PolicyDecision:
    outer_payload = event.get("tool_input") or event.get("input") or {}
    outer = evaluate_outer(outer_payload if isinstance(outer_payload, dict) else {})
    if not outer.allowed:
        return outer
    try:
        if runtime == "codex":
            normalized = normalize_codex(event, repository_root=repository_root)
        elif runtime == "claude":
            normalized = normalize_claude(event, repository_root=repository_root)
        else:
            return PolicyDecision.deny(
                "RUNTIME_PARITY_UNVERIFIED",
                "runtime has no verified authority-bearing write interception",
            )
        canonical = evaluate(normalized, state, clock=clock)
    except ControllerError as exc:
        canonical = PolicyDecision.deny("NORMALIZATION_FAILED", str(exc))
    return compose(outer, canonical)
