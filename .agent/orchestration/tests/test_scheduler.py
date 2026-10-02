import sys
import unittest
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(AGENT_ROOT))

from orchestration.scheduler import WriterConflict, WriterScheduler


class WriterSchedulerTests(unittest.TestCase):
    def test_overlapping_writers_are_serialized(self):
        scheduler = WriterScheduler()
        first = scheduler.acquire("coder-a", ["src/**"])
        with self.assertRaises(WriterConflict):
            scheduler.acquire("coder-b", ["src/api/**"])
        scheduler.release(first)
        second = scheduler.acquire("coder-b", ["src/api/**"])
        self.assertEqual(second.writer_key, "coder-b")

    def test_disjoint_writers_may_be_active_concurrently(self):
        scheduler = WriterScheduler()
        first = scheduler.acquire("coder-a", ["src/api/**"])
        second = scheduler.acquire("coder-b", ["web/**"])
        self.assertEqual(
            {lease.writer_key for lease in scheduler.active()},
            {"coder-a", "coder-b"},
        )
        scheduler.release(first)
        scheduler.release(second)
        self.assertEqual(scheduler.active(), ())

    def test_exact_path_overlap_is_serialized(self):
        scheduler = WriterScheduler()
        lease = scheduler.acquire("coder-a", ["README.md"])
        with self.assertRaises(WriterConflict):
            scheduler.acquire("coder-b", ["README.md"])
        scheduler.release(lease)


if __name__ == "__main__":
    unittest.main()
