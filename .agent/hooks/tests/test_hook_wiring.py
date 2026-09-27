"""Hook wiring regressions for WB-039.

Covers: stable-root hook resolution after a cwd change, wiring-failure
classification distinct from a policy denial, inertness of quoted redirect
text, Stop-hook lifecycle integrity without lifecycle mutation, and
cross-runtime adapter parity.
"""
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import types
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CLAUDE_HOOKS = ROOT / ".claude" / "hooks"
CODEX_HOOKS = ROOT / ".codex" / "hooks"
SETTINGS = ROOT / ".claude" / "settings.json"
GATE = ROOT / ".agent" / "active-work-block.json"
WIRING_MARKER = "[hook-wiring-failure]"
NESTED = ROOT / "web"


def run_hook(script: Path, event: dict, cwd: Path = ROOT) -> subprocess.CompletedProcess:
    env = {key: value for key, value in os.environ.items() if key != "CLAUDE_PROJECT_DIR"}
    return subprocess.run(
        [sys.executable, str(script)],
        input=json.dumps(event),
        text=True,
        capture_output=True,
        cwd=str(cwd),
        env=env,
        check=False,
    )


def payload(stdout: str) -> dict:
    try:
        value = json.loads(stdout)
    except (json.JSONDecodeError, TypeError):
        return {}
    specific = value.get("hookSpecificOutput") if isinstance(value, dict) else None
    return specific if isinstance(specific, dict) else {}


def decision(stdout: str) -> str:
    return str(payload(stdout).get("permissionDecision") or "allow")


def reason(stdout: str) -> str:
    return str(payload(stdout).get("permissionDecisionReason") or "")


def hook_commands() -> list[tuple[str, str]]:
    data = json.loads(SETTINGS.read_text(encoding="utf-8"))
    found: list[tuple[str, str]] = []
    for event, entries in data["hooks"].items():
        for entry in entries:
            for hook in entry["hooks"]:
                found.append((event, hook["command"]))
    return found


def bash_event(command: str) -> dict:
    return {"cwd": str(ROOT), "tool_name": "Bash", "tool_input": {"command": command}}


class HookRootStabilityTests(unittest.TestCase):
    def test_every_command_binds_to_a_stable_root(self):
        commands = hook_commands()
        self.assertEqual(len(commands), 4)
        for event, command in commands:
            self.assertIn("CLAUDE_PROJECT_DIR", command, event)
            self.assertIn(WIRING_MARKER, command, event)
            self.assertNotRegex(command, r"(python3|bash) \.(agent|claude)/", event)

    def test_nested_cwd_still_resolves_each_hook_class(self):
        events = {
            "PreToolUse": bash_event("true"),
            "PostToolUse": {"tool_input": {"file_path": str(ROOT / "web" / "src" / "i18n.js")}},
            "Stop": {"cwd": str(ROOT)},
        }
        for event, command in hook_commands():
            with self.subTest(event=event):
                env = dict(os.environ)
                env["CLAUDE_PROJECT_DIR"] = str(ROOT)
                result = subprocess.run(
                    ["bash", "-c", command],
                    input=json.dumps(events[event]),
                    text=True,
                    capture_output=True,
                    cwd=str(NESTED),
                    env=env,
                    check=False,
                )
                self.assertNotIn(WIRING_MARKER, result.stderr)

    def test_missing_entrypoint_is_a_wiring_failure_not_a_policy_denial(self):
        command = hook_commands()[0][1].replace(
            ".agent/hooks/hard_stop_policy.py", ".agent/hooks/absent_policy.py"
        )
        env = dict(os.environ)
        env["CLAUDE_PROJECT_DIR"] = str(ROOT)
        result = subprocess.run(
            ["bash", "-c", command],
            input=json.dumps(bash_event("true")),
            text=True,
            capture_output=True,
            cwd=str(NESTED),
            env=env,
            check=False,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn(WIRING_MARKER, result.stderr)
        self.assertNotIn("permissionDecision", result.stdout)


class QuotedRedirectionTests(unittest.TestCase):
    def test_quoted_redirect_text_is_inert_in_both_adapters(self):
        commands = [
            'grep -rn "2>/dev/null" scripts',
            "python3 -c \"print('a -> b')\"",
            'rg "cmd > out" docs',
        ]
        for command in commands:
            for script in (CLAUDE_HOOKS / "work_block_gate.py", CODEX_HOOKS / "pre_tool_use_policy.py"):
                with self.subTest(command=command, script=script.name):
                    result = run_hook(script, bash_event(command))
                    self.assertEqual(decision(result.stdout), "allow")
                    self.assertNotIn("Write path is outside repository", result.stdout)


class StopHookLifecycleTests(unittest.TestCase):
    def test_idle_gate_allows_stop_without_lifecycle_mutation(self):
        before = GATE.read_bytes()
        result = run_hook(CLAUDE_HOOKS / "assurance_gate.py", {"cwd": str(ROOT)})
        self.assertEqual(result.returncode, 0)
        self.assertNotIn('"decision": "block"', result.stdout)
        self.assertEqual(GATE.read_bytes(), before)

    def test_unresolved_active_work_block_keeps_enforcement_without_mutation(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / ".agent").mkdir(parents=True)
            gate = {
                "schema_version": 3,
                "authority_mode": "github_capability",
                "work_block_id": "WB-999",
                "subject_branch": "repair",
                "assurance": {},
                "closeout_mode": "pending",
            }
            target = root / ".agent" / "active-work-block.json"
            target.write_text(json.dumps(gate), encoding="utf-8")
            before = target.read_bytes()
            result = run_hook(CLAUDE_HOOKS / "assurance_gate.py", {"cwd": str(root)})
            self.assertEqual(result.returncode, 0)
            self.assertIn('"decision": "block"', result.stdout)
            self.assertEqual(target.read_bytes(), before)

    def test_stop_guard_honours_the_shared_evaluator(self):
        spec = importlib.util.spec_from_file_location(
            "assurance_gate_under_test", CLAUDE_HOOKS / "assurance_gate.py"
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        original = sys.modules.get("maintenance_mode")
        try:
            for verdict, expected in (("AUDIT", True), ("DENY", False)):
                stub = types.ModuleType("maintenance_mode")
                stub.decide = lambda *args, **kwargs: verdict
                sys.modules["maintenance_mode"] = stub
                self.assertIs(module.session_stop_downgraded(ROOT), expected, verdict)
        finally:
            if original is None:
                sys.modules.pop("maintenance_mode", None)
            else:
                sys.modules["maintenance_mode"] = original


class AdapterParityTests(unittest.TestCase):
    def test_equivalent_events_produce_equivalent_decisions(self):
        for path in (".claude/settings.json", "web/src/lib/api-security.ts"):
            with self.subTest(path=path):
                event = {
                    "cwd": str(ROOT),
                    "tool_name": "Edit",
                    "tool_input": {"file_path": path},
                }
                claude = run_hook(CLAUDE_HOOKS / "work_block_gate.py", event)
                codex = run_hook(CODEX_HOOKS / "pre_tool_use_policy.py", event)
                self.assertEqual(decision(claude.stdout), decision(codex.stdout))
                self.assertEqual(reason(claude.stdout), reason(codex.stdout))

    def test_out_of_scope_source_write_is_denied_by_both_adapters(self):
        event = {
            "cwd": str(ROOT),
            "tool_name": "Edit",
            "tool_input": {"file_path": "web/src/lib/api-security.ts"},
        }
        self.assertEqual(decision(run_hook(CLAUDE_HOOKS / "work_block_gate.py", event).stdout), "deny")
        self.assertEqual(
            decision(run_hook(CODEX_HOOKS / "pre_tool_use_policy.py", event).stdout), "deny"
        )


if __name__ == "__main__":
    unittest.main()
