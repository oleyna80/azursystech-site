import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

CONTROLLER_ROOT = Path(__file__).resolve().parents[3]
REPO_ROOT = CONTROLLER_ROOT.parent
BOOTSTRAP = REPO_ROOT / "scripts" / "sdlc-v1-bootstrap.py"


class BootstrapHelperTests(unittest.TestCase):
    def test_install_and_check_require_all_future_hooks_and_trusted_config(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp) / "repo"
            root.mkdir()
            subprocess.run(["git", "-C", str(root), "init", "-q", "-b", "main"], check=True)
            hooks = root / ".githooks"
            hooks.mkdir()
            for name in ("pre-commit", "commit-msg", "pre-push"):
                path = hooks / name
                path.write_text("#!/usr/bin/env bash\nexit 0\n", encoding="utf-8")
                path.chmod(0o755)
            registry = Path(temp) / "trusted" / "registry.sqlite3"
            registry.parent.mkdir()
            result = subprocess.run(
                [
                    sys.executable,
                    str(BOOTSTRAP),
                    "--root",
                    str(root),
                    "install",
                    "--repository",
                    "fixture/repo",
                    "--registry-path",
                    str(registry),
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            check = subprocess.run(
                [sys.executable, str(BOOTSTRAP), "--root", str(root), "check"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(check.returncode, 0, check.stderr)
            self.assertEqual(
                subprocess.check_output(
                    ["git", "-C", str(root), "config", "--get", "core.hooksPath"],
                    text=True,
                ).strip(),
                ".githooks",
            )
            config = root / ".git" / "azursystech" / "installation.json"
            self.assertTrue(config.exists())
            self.assertEqual(config.stat().st_mode & 0o777, 0o600)

    def test_install_fails_without_complete_hook_set(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp) / "repo"
            root.mkdir()
            subprocess.run(["git", "-C", str(root), "init", "-q", "-b", "main"], check=True)
            (root / ".githooks").mkdir()
            result = subprocess.run(
                [
                    sys.executable,
                    str(BOOTSTRAP),
                    "--root",
                    str(root),
                    "install",
                    "--repository",
                    "fixture/repo",
                    "--registry-path",
                    str(Path(temp) / "registry.sqlite3"),
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 2)


if __name__ == "__main__":
    unittest.main()
