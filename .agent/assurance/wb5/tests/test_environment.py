import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(AGENT_ROOT))

from assurance.wb5.environment import isolated_git_environment


class CanonicalEnvironmentTests(unittest.TestCase):
    def test_canonical_isolates_git_before_assurance_imports(self):
        repo_root = AGENT_ROOT.parent
        script = (repo_root / "scripts/verify-sdlc-replacement.py").read_text(
            encoding="utf-8"
        )
        isolation = script.index("isolate_process_git_environment()")
        rehearsal_import = script.index("from assurance.wb5.rehearsal import")
        validate_import = script.index("from assurance.wb5.validate import")
        self.assertLess(isolation, rehearsal_import)
        self.assertLess(isolation, validate_import)

    def test_hostile_global_signing_config_cannot_affect_git_commit(self):
        with tempfile.TemporaryDirectory(prefix="wb5-hostile-git-") as temp_raw:
            temp = Path(temp_raw)
            hostile = temp / "hostile.gitconfig"
            hostile.write_text(
                "[commit]\n"
                "\tgpgsign = true\n"
                "[gpg]\n"
                "\tprogram = /definitely/missing/wb5-gpg\n",
                encoding="utf-8",
            )
            inherited = os.environ.copy()
            inherited["GIT_CONFIG_GLOBAL"] = str(hostile)
            inherited["GIT_CONFIG_COUNT"] = "1"
            inherited["GIT_CONFIG_KEY_0"] = "commit.gpgsign"
            inherited["GIT_CONFIG_VALUE_0"] = "true"
            inherited["GIT_CONFIG_PARAMETERS"] = (
                "'commit.gpgsign=true' "
                "'gpg.program=/definitely/missing/wb5-gpg'"
            )

            env = isolated_git_environment(inherited)
            self.assertEqual(env["GIT_CONFIG_GLOBAL"], os.devnull)
            self.assertEqual(env["GIT_CONFIG_SYSTEM"], os.devnull)
            self.assertEqual(env["GIT_CONFIG_NOSYSTEM"], "1")
            self.assertNotIn("GIT_CONFIG_COUNT", env)
            self.assertNotIn("GIT_CONFIG_PARAMETERS", env)
            self.assertNotIn("GIT_CONFIG_KEY_0", env)
            self.assertNotIn("GIT_CONFIG_VALUE_0", env)

            repo = temp / "repo"
            subprocess.run(
                ["git", "init", "-q", "-b", "main", str(repo)],
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(repo), "config", "user.name", "WB5"],
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(repo), "config", "user.email", "wb5@example.invalid"],
                check=True,
                env=env,
            )
            (repo / "file.txt").write_text("content\n", encoding="utf-8")
            subprocess.run(
                ["git", "-C", str(repo), "add", "file.txt"],
                check=True,
                env=env,
            )
            result = subprocess.run(
                ["git", "-C", str(repo), "commit", "-qm", "deterministic"],
                check=False,
                capture_output=True,
                text=True,
                env=env,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertTrue(
                subprocess.check_output(
                    ["git", "-C", str(repo), "rev-parse", "--verify", "HEAD"],
                    text=True,
                    env=env,
                ).strip()
            )


if __name__ == "__main__":
    unittest.main()
