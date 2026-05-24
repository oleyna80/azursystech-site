import type { Pool } from "pg";
import { describe, expect, it, vi } from "vitest";

import type { SaveIntakeBriefInput } from "@/lib/intake/briefs";
import { createSqlIntakeBriefStore } from "@/lib/intake/sql-persistence";

const briefInput = {
  idempotencyKey: "brief_form:duplicate-key",
  source: "brief_form",
  status: "submitted",
  locale: "fr",
  payload: {
    preferredLanguage: "fr",
    missingFields: ["problem_statement"],
  },
  metadata: {
    test: true,
  },
  submittedAtUtc: "2026-05-24T12:00:00.000Z",
} satisfies SaveIntakeBriefInput;

function createMockPool(query: ReturnType<typeof vi.fn>): Pool {
  return {
    connect: vi.fn(async () => ({
      query,
      release: vi.fn(),
    })),
  } as unknown as Pool;
}

describe("SqlIntakeBriefStore", () => {
  it("returns the inserted brief without a duplicate lookup", async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: "brief:new", status: "submitted", inserted: true }],
      })
      .mockResolvedValueOnce({ rows: [] });
    const store = createSqlIntakeBriefStore(createMockPool(query));

    await expect(store.saveBrief(briefInput)).resolves.toEqual({
      briefId: "brief:new",
      status: "submitted",
      inserted: true,
    });
    expect(query).toHaveBeenCalledTimes(3);
    expect(String(query.mock.calls[2]?.[0])).toBe("COMMIT");
  });

  it("selects an existing brief in a separate statement after a duplicate insert", async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: "brief:existing", status: "submitted", inserted: false }],
      })
      .mockResolvedValueOnce({ rows: [] });
    const store = createSqlIntakeBriefStore(createMockPool(query));

    await expect(store.saveBrief(briefInput)).resolves.toEqual({
      briefId: "brief:existing",
      status: "submitted",
      inserted: false,
    });
    expect(query).toHaveBeenCalledTimes(4);
    expect(String(query.mock.calls[2]?.[0])).toContain(
      "WHERE idempotency_key = $1",
    );
    expect(String(query.mock.calls[3]?.[0])).toBe("COMMIT");
  });
});
