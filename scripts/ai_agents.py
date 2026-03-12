#!/usr/bin/env python3
"""CLI wrapper for AzurSysTech AI agents."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
AI_DIR = REPO_ROOT / "05_ai"
REGISTRY_PATH = AI_DIR / "agents" / "registry.json"
RUNS_DIR = AI_DIR / "runs"
PLACEHOLDER_RE = re.compile(r"{{\s*([a-zA-Z0-9_.-]+)\s*}}")


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def deep_get(payload: dict[str, Any], dotted_key: str) -> Any:
    current: Any = payload
    for part in dotted_key.split("."):
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            raise KeyError(dotted_key)
    return current


def render_template(template: str, payload: dict[str, Any]) -> tuple[str, set[str]]:
    missing: set[str] = set()

    def replace(match: re.Match[str]) -> str:
        key = match.group(1)
        try:
            value = deep_get(payload, key)
        except KeyError:
            missing.add(key)
            return f"<<MISSING:{key}>>"

        if value is None:
            return ""
        if isinstance(value, (dict, list)):
            return json.dumps(value, ensure_ascii=False, indent=2)
        return str(value)

    return PLACEHOLDER_RE.sub(replace, template), missing


def read_context(context_files: list[str], max_chars_per_file: int) -> str:
    sections: list[str] = []
    for relative_path in context_files:
        path = REPO_ROOT / relative_path
        if not path.exists():
            continue

        raw = path.read_text(encoding="utf-8").strip()
        if not raw:
            continue

        if len(raw) > max_chars_per_file:
            raw = raw[:max_chars_per_file].rstrip() + "\n\n[...truncated...]"

        sections.append(f"### {relative_path}\n{raw}")

    return "\n\n".join(sections)


def build_response_payload(model: str, system_prompt: str, user_prompt: str, temperature: float) -> dict[str, Any]:
    return {
        "model": model,
        "temperature": temperature,
        "input": [
            {
                "role": "system",
                "content": [{"type": "input_text", "text": system_prompt}],
            },
            {
                "role": "user",
                "content": [{"type": "input_text", "text": user_prompt}],
            },
        ],
    }


def call_openai(payload: dict[str, Any]) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    url = f"{base_url}/responses"
    request = urllib.request.Request(
        url=url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI API error {exc.code}: {body}") from exc


def extract_output_text(raw_response: dict[str, Any]) -> str:
    output_text = raw_response.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    chunks: list[str] = []
    for item in raw_response.get("output", []):
        if not isinstance(item, dict):
            continue
        for content in item.get("content", []):
            if not isinstance(content, dict):
                continue
            if content.get("type") in {"output_text", "text"}:
                text = content.get("text")
                if isinstance(text, str) and text.strip():
                    chunks.append(text.strip())

    return "\n\n".join(chunks).strip()


def detect_escalation(input_payload: dict[str, Any], output_text: str, keywords: list[str]) -> list[str]:
    # Context documents are long and may contain trigger words unrelated to the current request.
    filtered_input = {k: v for k, v in input_payload.items() if k != "project_context"}
    haystack = f"{json.dumps(filtered_input, ensure_ascii=False)}\n{output_text}".lower()
    return [keyword for keyword in keywords if keyword.lower() in haystack]


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_approval_note(path: Path, run: dict[str, Any]) -> None:
    note = (
        f"# Approval Required: {run['agent_id']}\n\n"
        f"- Run ID: `{run['run_id']}`\n"
        f"- Created: `{run['created_at_utc']}`\n"
        f"- Status: `{run['status']}`\n\n"
        "## Proposed Output\n\n"
        f"{run['output_text']}\n\n"
        "## Decision\n\n"
        "- [ ] Approve and publish\n"
        "- [ ] Request changes\n"
        "- [ ] Escalate to human operator\n"
    )
    path.write_text(note, encoding="utf-8")


def command_list(args: argparse.Namespace) -> int:
    registry = load_json(REGISTRY_PATH)
    agents = registry.get("agents", {})
    if not agents:
        print("No agents found in registry.")
        return 1

    for agent_id, config in agents.items():
        description = config.get("description", "")
        model = config.get("model", "")
        approval = "yes" if config.get("requires_approval") else "no"
        print(f"{agent_id:16} model={model:14} approval={approval:3} {description}")
    return 0


def command_run(args: argparse.Namespace) -> int:
    registry = load_json(REGISTRY_PATH)
    agents = registry.get("agents", {})
    if args.agent not in agents:
        print(f"Unknown agent: {args.agent}", file=sys.stderr)
        return 1

    agent = agents[args.agent]
    payload: dict[str, Any] = {}

    if args.input_file:
        payload.update(load_json(Path(args.input_file)))
    if args.input_json:
        payload.update(json.loads(args.input_json))

    payload.setdefault("project_name", "AzurSysTech")
    payload.setdefault("run_timestamp_utc", dt.datetime.now(dt.timezone.utc).isoformat())

    context_files = agent.get("context_files", [])
    payload.setdefault(
        "project_context",
        read_context(context_files=context_files, max_chars_per_file=args.max_context_chars),
    )

    missing_required = [field for field in agent.get("required_fields", []) if not payload.get(field)]
    if missing_required:
        print(
            "Missing required fields in payload: " + ", ".join(missing_required),
            file=sys.stderr,
        )
        return 2

    system_template_path = REPO_ROOT / agent["system_prompt_file"]
    user_template_path = REPO_ROOT / agent["user_prompt_file"]

    system_prompt, missing_system = render_template(
        system_template_path.read_text(encoding="utf-8"),
        payload,
    )
    user_prompt, missing_user = render_template(
        user_template_path.read_text(encoding="utf-8"),
        payload,
    )

    missing_placeholders = sorted(missing_system.union(missing_user))
    if missing_placeholders and not args.allow_missing_placeholders:
        print(
            "Unresolved placeholders: " + ", ".join(missing_placeholders),
            file=sys.stderr,
        )
        return 2

    if args.print_prompts:
        print("----- SYSTEM PROMPT -----")
        print(system_prompt)
        print("\n----- USER PROMPT -----")
        print(user_prompt)
        print("-------------------------")

    model = args.model or agent.get("model", "gpt-4.1-mini")
    temperature = args.temperature
    if temperature is None:
        temperature = float(agent.get("temperature", 0.2))

    raw_response: dict[str, Any] | None = None
    output_text = ""

    if args.dry_run:
        output_text = "[DRY RUN] API call skipped. Prompt assembly completed successfully."
    else:
        request_payload = build_response_payload(
            model=model,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
        )
        raw_response = call_openai(request_payload)
        output_text = extract_output_text(raw_response)

    escalation_hits = detect_escalation(
        input_payload=payload,
        output_text=output_text,
        keywords=agent.get("escalation_keywords", []),
    )

    status = "completed"
    if args.dry_run:
        status = "dry_run"
    elif escalation_hits:
        status = "escalated"
    elif agent.get("requires_approval") and not args.auto_approve:
        status = "pending_approval"

    run_id = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%S.%fZ") + f"-{args.agent}"
    run_payload = {
        "run_id": run_id,
        "agent_id": args.agent,
        "created_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "model": model,
        "temperature": temperature,
        "status": status,
        "escalation_hits": escalation_hits,
        "input": payload,
        "system_prompt": system_prompt,
        "user_prompt": user_prompt,
        "output_text": output_text,
        "raw_response": raw_response,
    }

    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    run_file = RUNS_DIR / f"{run_id}.json"
    write_json(run_file, run_payload)

    approval_file: Path | None = None
    if status == "pending_approval":
        approval_file = RUNS_DIR / f"{run_id}.approval.md"
        write_approval_note(approval_file, run_payload)

    if args.output_file:
        Path(args.output_file).write_text(output_text + "\n", encoding="utf-8")

    print(f"Run created: {run_file}")
    print(f"Status: {status}")
    if escalation_hits:
        print("Escalation keywords: " + ", ".join(escalation_hits))
    if approval_file:
        print(f"Approval note: {approval_file}")
    if output_text:
        print("\nOutput:\n")
        print(output_text)

    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AzurSysTech AI agent runner")
    subparsers = parser.add_subparsers(dest="command")

    list_parser = subparsers.add_parser("list", help="List registered agents")
    list_parser.set_defaults(func=command_list)

    run_parser = subparsers.add_parser("run", help="Run a specific agent")
    run_parser.add_argument("--agent", required=True, help="Agent id from registry")
    run_parser.add_argument("--input-file", help="Path to JSON payload")
    run_parser.add_argument("--input-json", help="Inline JSON payload")
    run_parser.add_argument("--output-file", help="Where to save model output")
    run_parser.add_argument("--model", help="Override model")
    run_parser.add_argument("--temperature", type=float, help="Override temperature")
    run_parser.add_argument(
        "--max-context-chars",
        type=int,
        default=3000,
        help="Max chars to load per context file",
    )
    run_parser.add_argument(
        "--allow-missing-placeholders",
        action="store_true",
        help="Allow unresolved {{placeholders}} in prompt templates",
    )
    run_parser.add_argument("--print-prompts", action="store_true", help="Print rendered prompts")
    run_parser.add_argument("--auto-approve", action="store_true", help="Skip pending approval state")
    run_parser.add_argument("--dry-run", action="store_true", help="Do not call OpenAI API")
    run_parser.set_defaults(func=command_run)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    try:
        return args.func(args)
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON: {exc}", file=sys.stderr)
        return 2
    except FileNotFoundError as exc:
        print(f"File not found: {exc}", file=sys.stderr)
        return 2
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
