import { afterEach, describe, expect, it, vi } from "vitest";

import type { IntakeDecision } from "@/lib/intake/types";

const decision: IntakeDecision = {
  action: "ask_followup",
  idempotencyKey: "telegram:1:2",
  assistantReply: "Tell me more.",
  briefDraft: {
    preferredLanguage: "fr",
    missingFields: ["contact_hint"],
  },
  safety: {
    deflectedCommitment: false,
    duplicateProviderEvent: false,
    sanitizedForLogs: true,
  },
  rateLimit: {
    status: "deferred_to_channel_route",
    key: "telegram:1",
  },
};

vi.mock("@/lib/intake/runtime", () => ({
  runIntakeDryRun: vi.fn(() => decision),
}));

vi.mock("@/lib/intake/storage", () => ({
  loadIntakeConversationState: vi.fn(async () => undefined),
  persistIntakeDecision: vi.fn(async () => ({ status: "skipped_legacy" })),
}));

import { persistIntakeDecision } from "@/lib/intake/storage";
import { runTelegramIntakeDryRun } from "@/lib/telegram/dry-run";

afterEach(() => {
  vi.clearAllMocks();
});

describe("telegram dry-run intake", () => {
  it("returns persistence unavailable when dual SQL persistence fails open", async () => {
    vi.mocked(persistIntakeDecision).mockResolvedValueOnce({
      status: "failed_open_dual",
    });

    const result = await runTelegramIntakeDryRun({
      message: {
        text: "hello",
        chat: { id: 1 },
        from: { id: 2, language_code: "fr" },
      },
    });

    expect(result).toEqual({
      ok: false,
      persistence: "unavailable",
    });
  });

  it("keeps legacy no-op persistence successful", async () => {
    vi.mocked(persistIntakeDecision).mockResolvedValueOnce({
      status: "skipped_legacy",
    });

    const result = await runTelegramIntakeDryRun({
      message: {
        text: "hello",
        chat: { id: 1 },
        from: { id: 2, language_code: "fr" },
      },
    });

    expect(result).toEqual({
      ok: true,
      decision,
    });
  });
});
