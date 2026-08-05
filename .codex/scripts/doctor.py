#!/usr/bin/env python3
"""Read-only Codex doctor; optional CLI availability is not a native smoke."""
from __future__ import annotations
import argparse, json, os, shutil, subprocess, tempfile
from pathlib import Path
SENSITIVE = ("token", "secret", "password", "key", "credential")
SIGNER_ENV = "AGENTIC_SDLC_OWNER_SIGNERS"
SIGNER_IDENTITY = "owner@agentic-sdlc"
SIGNER_NAMESPACE = "agentic-sdlc-authorization"
def redact(value):
    if isinstance(value, dict): return {key: ("[REDACTED]" if any(word in key.lower() for word in SENSITIVE) else redact(item)) for key, item in value.items()}
    if isinstance(value, list): return [redact(item) for item in value]
    return value
def signature_readiness(state, gate):
    raw = os.environ.get(SIGNER_ENV)
    if not raw: return {"name": "owner_trust_anchor", "result": "UNVERIFIED", "detail": f"set {SIGNER_ENV} to an external allowed_signers file"}
    anchor = Path(raw).expanduser()
    root = state.resolve().parent.parent
    try:
        resolved = anchor.resolve(strict=True)
        resolved.relative_to(root)
        return {"name": "owner_trust_anchor", "result": "UNVERIFIED", "detail": "trust anchor must be outside the mutable project"}
    except ValueError:
        pass
    except OSError as exc:
        return {"name": "owner_trust_anchor", "result": "UNVERIFIED", "detail": f"trust anchor unavailable: {exc}"}
    if not resolved.is_file(): return {"name": "owner_trust_anchor", "result": "UNVERIFIED", "detail": "trust anchor is not a file"}
    auth = gate.get("authorization") if isinstance(gate, dict) else None
    if not isinstance(auth, dict) or not isinstance(auth.get("path"), str) or not auth["path"].strip(): return {"name": "authorization_signature", "result": "not_run", "detail": "no authorization record is bound to the current gate"}
    path = auth["path"]; signature = f"{path}.sig"
    try:
        record = subprocess.run(["git", "show", f"HEAD:{path}"], cwd=root, text=True, capture_output=True, check=True, timeout=5).stdout
        sig = subprocess.run(["git", "show", f"HEAD:{signature}"], cwd=root, text=True, capture_output=True, check=True, timeout=5).stdout
        if (root / path).read_text(encoding="utf-8") != record or (root / signature).read_text(encoding="utf-8") != sig: raise ValueError("record or signature differs from HEAD")
        result = subprocess.run(["ssh-keygen", "-Y", "verify", "-f", str(resolved), "-I", SIGNER_IDENTITY, "-n", SIGNER_NAMESPACE, "-s", str(root / signature)], input=record, text=True, capture_output=True, check=False, timeout=5)
    except (OSError, subprocess.SubprocessError, ValueError) as exc:
        return {"name": "authorization_signature", "result": "UNVERIFIED", "detail": f"signature readiness unavailable: {exc}"}
    return {"name": "authorization_signature", "result": "READY" if result.returncode == 0 else "UNVERIFIED", "detail": "committed authorization signature checked against external trust anchor"}
def main():
    parser = argparse.ArgumentParser(); parser.add_argument("--state", type=Path, default=Path(".agent/active-work-block.json")); parser.add_argument("--live", action="store_true"); args = parser.parse_args()
    report = {"schema_version": 1, "artifact_type": "codex_doctor", "authority": "none", "state": "UNVERIFIED", "live_requested": args.live, "checks": []}
    gate = None
    try: gate = json.loads(args.state.read_text(encoding="utf-8")); report["gate"] = redact(gate)
    except (OSError, json.JSONDecodeError) as exc: report["checks"].append({"name": "gate", "result": "UNVERIFIED", "detail": str(exc)})
    if gate is not None:
        report["checks"].append(signature_readiness(args.state, gate))
    executable = shutil.which("codex")
    if not args.live: report["checks"].append({"name": "cli_availability", "result": "not_run", "detail": "opt in with --live; normal CI never invokes Codex"})
    elif not executable: report["checks"].append({"name": "cli_availability", "result": "UNVERIFIED", "detail": "codex CLI unavailable"})
    else:
        with tempfile.TemporaryDirectory(prefix="codex-doctor-") as temporary:
            repo = Path(temporary); subprocess.run(["git", "init", "-q", str(repo)], check=True, timeout=10)
            result = subprocess.run([executable, "--version"], cwd=repo, text=True, capture_output=True, check=False, timeout=20, env={"PATH": str(Path(executable).parent)})
        report["checks"].append({"name": "cli_availability", "result": "AVAILABLE" if result.returncode == 0 else "UNVERIFIED", "detail": "local disposable-repository version check; hooks were not exercised"})
    print(json.dumps(report, sort_keys=True)); return 0
if __name__ == "__main__": raise SystemExit(main())
