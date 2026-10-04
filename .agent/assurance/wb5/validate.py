"""Machine-readable WB-005 artifact validation."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

BASELINE_SHA = "de129c8c8e924ff9b1b96a49e853a501f2171f1f"
CANONICAL_PATHS = {
    "patch": ".agent/assurance/wb5/cutover.patch",
    "manifest": ".agent/assurance/wb5/cutover-manifest.json",
    "corpus": ".agent/assurance/wb5/comparison-corpus.json",
    "checklist": ".agent/assurance/wb5/cutover-checklist.md",
}
CLASSIFICATIONS = {
    "EQUIVALENT",
    "INTENTIONAL_CHANGE",
    "REMOVED_OR_TRANSFERRED_LEGACY_MECHANISM",
}
DISPOSITIONS = {"REMOVE", "RETAIN_NON_AUTHORITY"}


class AssuranceValidationError(Exception):
    pass


def _run(root: Path, *args: str, input_bytes: bytes | None = None) -> subprocess.CompletedProcess:
    try:
        return subprocess.run(
            ["git", "-C", str(root), *args],
            input=input_bytes,
            check=True,
            capture_output=True,
        )
    except subprocess.SubprocessError as exc:
        raise AssuranceValidationError("Git validation failed") from exc


def _blob(root: Path, revision: str, path: str) -> str | None:
    result = subprocess.run(
        ["git", "-C", str(root), "rev-parse", "--verify", f"{revision}:{path}"],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return None
    value = result.stdout.strip()
    if re.fullmatch(r"[0-9a-f]{40}", value) is None:
        raise AssuranceValidationError(f"invalid blob identity for {path}")
    return value


def _mode(root: Path, revision: str, path: str) -> str | None:
    result = subprocess.run(
        ["git", "-C", str(root), "ls-tree", revision, "--", path],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0 or not result.stdout.strip():
        return None
    return result.stdout.split()[0]


def git_blob_sha(root: Path, payload: bytes) -> str:
    result = _run(root, "hash-object", "--stdin", input_bytes=payload)
    value = result.stdout.decode().strip()
    if re.fullmatch(r"[0-9a-f]{40}", value) is None:
        raise AssuranceValidationError("invalid Git blob hash")
    return value


def patch_paths(patch_bytes: bytes) -> tuple[str, ...]:
    try:
        text = patch_bytes.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise AssuranceValidationError("cutover patch is not UTF-8") from exc
    paths = re.findall(r"(?m)^diff --git a/(.+) b/\1$", text)
    if not paths or len(paths) != len(set(paths)):
        raise AssuranceValidationError("cutover patch path set is invalid")
    return tuple(paths)


def validate_manifest(root: Path, manifest: dict, patch_bytes: bytes) -> None:
    if not isinstance(manifest, dict) or manifest.get("schema_version") != 1:
        raise AssuranceValidationError("invalid cutover manifest schema")
    if manifest.get("baseline_sha") != BASELINE_SHA:
        raise AssuranceValidationError("manifest baseline mismatch")
    if manifest.get("patch_blob_sha") != git_blob_sha(root, patch_bytes):
        raise AssuranceValidationError("patch blob identity mismatch")
    entries = manifest.get("live_wiring_paths")
    if not isinstance(entries, list) or not entries:
        raise AssuranceValidationError("manifest live-wiring set is empty")
    declared = tuple(item.get("path") for item in entries if isinstance(item, dict))
    if set(declared) != set(patch_paths(patch_bytes)) or len(declared) != len(set(declared)):
        raise AssuranceValidationError("patch path set differs from manifest")
    for item in entries:
        path = item["path"]
        if item.get("action") not in {"ADD", "REPLACE"}:
            raise AssuranceValidationError(f"unsupported cutover action: {path}")
        if item.get("preimage_blob_sha") != _blob(root, BASELINE_SHA, path):
            raise AssuranceValidationError(f"preimage blob mismatch: {path}")
        if item.get("preimage_mode") != _mode(root, BASELINE_SHA, path):
            raise AssuranceValidationError(f"preimage mode mismatch: {path}")
        if re.fullmatch(r"[0-9a-f]{40}", str(item.get("postimage_blob_sha") or "")) is None:
            raise AssuranceValidationError(f"invalid postimage blob: {path}")
        if item.get("postimage_mode") not in {"100644", "100755"}:
            raise AssuranceValidationError(f"invalid postimage mode: {path}")
    for entry in manifest.get("legacy_entrypoints", []):
        if entry.get("disposition") not in DISPOSITIONS:
            raise AssuranceValidationError("invalid legacy entrypoint disposition")


def validate_corpus(root: Path, corpus: dict) -> None:
    if not isinstance(corpus, dict) or corpus.get("schema_version") != 1:
        raise AssuranceValidationError("invalid comparison corpus schema")
    if corpus.get("baseline_sha") != BASELINE_SHA:
        raise AssuranceValidationError("comparison baseline mismatch")
    scenarios = corpus.get("scenarios")
    if not isinstance(scenarios, list) or not scenarios:
        raise AssuranceValidationError("comparison corpus is empty")
    seen = set()
    for scenario in scenarios:
        identifier = scenario.get("scenario_id") if isinstance(scenario, dict) else None
        if not isinstance(identifier, str) or not identifier or identifier in seen:
            raise AssuranceValidationError("comparison scenario id invalid/duplicate")
        seen.add(identifier)
        classification = scenario.get("classification")
        if classification not in CLASSIFICATIONS:
            raise AssuranceValidationError(f"invalid classification: {identifier}")
        ref = scenario.get("accepted_requirement_ref")
        if not isinstance(ref, dict) or set(ref) != {"path", "contains"}:
            raise AssuranceValidationError(f"invalid requirement reference: {identifier}")
        try:
            text = _run(root, "show", f"{BASELINE_SHA}:{ref['path']}").stdout.decode()
        except (KeyError, UnicodeDecodeError) as exc:
            raise AssuranceValidationError(f"invalid requirement reference: {identifier}") from exc
        if not isinstance(ref.get("contains"), str) or ref["contains"] not in text:
            raise AssuranceValidationError(
                f"requirement reference not present at frozen baseline: {identifier}"
            )
        old = scenario.get("legacy_result")
        new = scenario.get("replacement_result")
        if (
            scenario.get("security_sensitive") is True
            and isinstance(old, str)
            and isinstance(new, str)
            and old.startswith("DENY")
            and new.startswith("ALLOW")
            and classification != "INTENTIONAL_CHANGE"
        ):
            raise AssuranceValidationError(
                f"security relaxation not intentionally classified: {identifier}"
            )
        if classification == "REMOVED_OR_TRANSFERRED_LEGACY_MECHANISM":
            if scenario.get("authority_disposition") not in {"OBSOLETE", "TRANSFERRED"}:
                raise AssuranceValidationError(f"invalid authority disposition: {identifier}")
            for key in ("transferred_to", "replacement_test"):
                if not isinstance(scenario.get(key), str) or not scenario[key]:
                    raise AssuranceValidationError(
                        f"removed/transferred scenario lacks {key}: {identifier}"
                    )


def validate_source_artifacts(root: Path) -> None:
    root = Path(root).resolve()
    patch = (root / CANONICAL_PATHS["patch"]).read_bytes()
    manifest = json.loads((root / CANONICAL_PATHS["manifest"]).read_text(encoding="utf-8"))
    corpus = json.loads((root / CANONICAL_PATHS["corpus"]).read_text(encoding="utf-8"))
    validate_manifest(root, manifest, patch)
    validate_corpus(root, corpus)
