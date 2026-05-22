import { afterEach, describe, expect, it, vi } from "vitest";

import type { IntakeDecision } from "@/lib/intake/types";

const decision: IntakeDecision = {
  action: "ask_followup",
  idempotencyKey: "web-chat:1",
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
    key: "web-chat:1",
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
import { runWebChatIntakeDryRun } from "@/lib/web-chat/dry-run";

afterEach(() => {
  vi.clearAllMocks();
});

describe("web-chat dry-run intake", () => {
  it("returns persistence unavailable when dual SQL persistence fails open", async () => {
    vi.mocked(persistIntakeDecision).mockResolvedValueOnce({
      status: "failed_open_dual",
    });

    const result = await runWebChatIntakeDryRun({
      message: "hello",
      locale: "fr",
      conversationKey: "web-chat:1",
      senderKey: "web-chat:1",
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

    const result = await runWebChatIntakeDryRun({
      message: "hello",
      locale: "fr",
      conversationKey: "web-chat:1",
      senderKey: "web-chat:1",
    });

    expect(result).toEqual({
      ok: true,
      decision,
    });
  });
});
