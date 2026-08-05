#!/usr/bin/env python3
"""Fail-closed local lifecycle helper with externally anchored Owner signatures."""
from __future__ import annotations
import argparse, datetime as dt, json, os, subprocess, tempfile
from pathlib import Path

SIGNER_ENV = "AGENTIC_SDLC_OWNER_SIGNERS"
SIGNER_IDENTITY = "owner@agentic-sdlc"
SIGNER_NAMESPACE = "agentic-sdlc-authorization"

def run(root, *args):
    return subprocess.run(["git", *args], cwd=root, text=True, capture_output=True, check=False, timeout=5)
def now(): return dt.datetime.now(dt.timezone.utc)
def timestamp(value):
    parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None: raise ValueError("expiry must include timezone")
    return parsed
def read(path):
    try: value = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"malformed state: {exc}") from exc
    if not isinstance(value, dict): raise ValueError("state must be object")
    return value
def atomic(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", dir=path.parent, delete=False) as out: json.dump(value, out, indent=2, sort_keys=True); out.write("\n"); temp=Path(out.name)
    temp.replace(path)
def signer_file(root):
    raw=os.environ.get(SIGNER_ENV)
    if not raw: raise ValueError(f"{SIGNER_ENV} must name the external Owner trust anchor")
    path=Path(raw).expanduser()
    if not path.is_absolute(): raise ValueError(f"{SIGNER_ENV} must be an absolute path")
    try: resolved=path.resolve(strict=True)
    except OSError as exc: raise ValueError(f"Owner trust anchor is unavailable: {exc}") from exc
    try: resolved.relative_to(root)
    except ValueError: pass
    else: raise ValueError("Owner trust anchor must not reside in the mutable project")
    if not resolved.is_file(): raise ValueError("Owner trust anchor must be a file")
    return resolved
def signature(root, authorization_path, record_text, value):
    signature_info=value.get("signature")
    expected=f"{authorization_path}.sig"
    if not isinstance(signature_info,dict) or signature_info.get("path") != expected:
        raise ValueError("authorization requires a detached sibling signature")
    shown=run(root,"show",f"HEAD:{expected}")
    if shown.returncode: raise ValueError("authorization signature is not committed in HEAD")
    blob=run(root,"rev-parse",f"HEAD:{expected}").stdout.strip()
    disk=root/expected
    if not disk.is_file() or disk.read_text()!=shown.stdout:
        raise ValueError("authorization signature working-tree content differs from HEAD")
    try:
        verified=subprocess.run(["ssh-keygen","-Y","verify","-f",str(signer_file(root)),"-I",SIGNER_IDENTITY,"-n",SIGNER_NAMESPACE,"-s",str(disk)], input=record_text, text=True, capture_output=True, check=False, timeout=5)
    except OSError as exc: raise ValueError(f"Owner signature verifier is unavailable: {exc}") from exc
    if verified.returncode != 0: raise ValueError("authorization Owner signature is invalid")
    return expected, blob
def authorization(root, path):
    if not path.startswith(".agent/authorizations/") or not path.endswith(".json"): raise ValueError("authorization path is invalid")
    shown=run(root,"show",f"HEAD:{path}")
    if shown.returncode: raise ValueError("authorization is not committed in HEAD")
    blob=run(root,"rev-parse",f"HEAD:{path}").stdout.strip()
    disk=root/path
    if not disk.is_file() or disk.read_text()!=shown.stdout: raise ValueError("authorization working-tree content differs from HEAD")
    try: value=json.loads(shown.stdout)
    except json.JSONDecodeError as exc: raise ValueError("authorization JSON malformed") from exc
    required=("work_block_id","specification","spec_digest","write_set","expires_at","status","owner_evidence","critic","signature")
    if not isinstance(value,dict) or any(not value.get(key) for key in required): raise ValueError("authorization envelope incomplete")
    critic=value["critic"]
    if value["status"] != "APPROVED" or not isinstance(value["write_set"],list) or not value["write_set"] or not isinstance(critic,dict) or critic.get("status") != "READY" or critic.get("verdict") not in {"APPROVE","APPROVED"}: raise ValueError("authorization is not approved with ready Critic evidence and a non-empty write-set")
    if timestamp(value["expires_at"]) <= now(): raise ValueError("authorization expired")
    signature_path, signature_blob=signature(root,path,shown.stdout,value)
    return value, blob, signature_path, signature_blob
def bound_authorization(root, value):
    if value.get("schema_version") != 2: raise ValueError("renew requires active-work-block schema_version=2")
    reference=value.get("authorization")
    if not isinstance(reference,dict) or not isinstance(reference.get("path"),str): raise ValueError("renew requires an authorization binding")
    auth, blob, signature_path, signature_blob=authorization(root,reference["path"])
    expected={
        "work_block_id": auth["work_block_id"], "specification": auth["specification"],
        "spec_digest": auth["spec_digest"], "write_set": auth["write_set"],
        "critic": auth["critic"],
    }
    for key, expected_value in expected.items():
        if value.get(key) != expected_value: raise ValueError(f"renew active state {key} differs from signed authorization")
    if reference.get("blob_id") != blob: raise ValueError("renew authorization JSON blob binding differs from signed authorization")
    if reference.get("signature_path") != signature_path or reference.get("signature_blob_id") != signature_blob:
        raise ValueError("renew authorization signature blob binding differs from signed authorization")
    return auth
def blocked(reason): return {"schema_version":2,"work_block_id":"","write_gate":{"status":"BLOCKED","opened_at":None,"expires_at":None},"write_set":[],"lifecycle_note":reason}
def main():
    parser=argparse.ArgumentParser(); parser.add_argument("--state",type=Path,default=Path(".agent/active-work-block.json")); parser.add_argument("--root",type=Path,default=Path.cwd()); subs=parser.add_subparsers(dest="command",required=True); subs.add_parser("status"); prep=subs.add_parser("prepare"); prep.add_argument("--reason",default="coordination")
    opening=subs.add_parser("open"); opening.add_argument("--authorization",required=True)
    renew=subs.add_parser("renew"); renew.add_argument("--expires-at",required=True)
    for name in ("freeze","close"): subs.add_parser(name).add_argument("--reason",required=True)
    args=parser.parse_args(); root=args.root.resolve(); state=args.state.resolve()
    if args.command=="prepare": value=blocked(args.reason)
    else:
      value=read(state)
      if args.command=="status": print(json.dumps(value,sort_keys=True)); return 0
      if args.command=="open":
        auth, blob, signature_path, signature_blob=authorization(root,args.authorization); head=run(root,"rev-parse","HEAD").stdout.strip(); value={"schema_version":2,"work_block_id":auth["work_block_id"],"specification":auth["specification"],"spec_digest":auth["spec_digest"],"base_commit":head,"authorization":{"path":args.authorization,"blob_id":blob,"signature_path":signature_path,"signature_blob_id":signature_blob},"critic":auth.get("critic",{}),"write_set":auth["write_set"],"write_gate":{"status":"READY","opened_at":now().isoformat(),"expires_at":auth["expires_at"]}}
      elif args.command=="renew":
        if value.get("write_gate",{}).get("status")!="READY" or value.get("base_commit")!=run(root,"rev-parse","HEAD").stdout.strip(): raise ValueError("renew cannot repair blocked or stale authority")
        auth=bound_authorization(root,value); requested=timestamp(args.expires_at); ceiling=timestamp(auth["expires_at"])
        if requested>ceiling or requested<=now(): raise ValueError("renew exceeds committed authorization ceiling")
        value["write_gate"]["expires_at"]=args.expires_at
      else: value=blocked(args.reason)
    atomic(state,value); print(json.dumps(value,sort_keys=True)); return 0
if __name__=="__main__":
  try: raise SystemExit(main())
  except ValueError as exc: print(f"BLOCKED: {exc}"); raise SystemExit(2)
