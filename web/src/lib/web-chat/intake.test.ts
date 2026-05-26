import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/intake/storage", () => ({
  loadIntakeConversationState: vi.fn(async () => undefined),
  persistIntakeDecision: vi.fn(async () => ({ status: "skipped_legacy" })),
}));

vi.mock("@/lib/web-chat/llm", () => ({
  generateWebChatLlmReply: vi.fn(async () => ({
    ok: true,
    provider: "deepseek",
    reply: "LLM reply that helps with the brief field.",
  })),
}));

import { persistIntakeDecision } from "@/lib/intake/storage";
import { generateWebChatLlmReply } from "@/lib/web-chat/llm";
import { runWebChatIntake } from "@/lib/web-chat/intake";

afterEach(() => {
  vi.clearAllMocks();
});

describe("web-chat live intake", () => {
  it("uses advisory LLM for live replies and persists the final assistant reply", async () => {
    const result = await runWebChatIntake({
      message: "Я заполняю бриф. Что писать про CRM и Telegram?",
      locale: "ru",
      conversationKey: "web-chat:1",
      senderKey: "web-chat:1",
      providerMessageId: "message:1",
      history: [
        { role: "user", content: "Здравствуйте" },
        { role: "assistant", content: "Чем занимается ваш бизнес?" },
      ],
      llmMode: "enabled",
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        decision: expect.objectContaining({
          assistantReply: "LLM reply that helps with the brief field.",
        }),
      }),
    );
    expect(generateWebChatLlmReply).toHaveBeenCalledWith(
      expect.objectContaining({
        history: [
          { role: "user", content: "Здравствуйте" },
          { role: "assistant", content: "Чем занимается ваш бизнес?" },
        ],
      }),
    );
    expect(persistIntakeDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: expect.objectContaining({
          assistantReply: "LLM reply that helps with the brief field.",
        }),
      }),
    );
  });

  it("falls back to deterministic runtime reply when LLM is unavailable", async () => {
    vi.mocked(generateWebChatLlmReply).mockResolvedValueOnce({
      ok: false,
      reason: "provider_error",
    });

    const result = await runWebChatIntake({
      message: "Сколько стоит автоматизация заявок?",
      locale: "ru",
      conversationKey: "web-chat:1",
      senderKey: "web-chat:1",
      providerMessageId: "message:2",
      llmMode: "enabled",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.decision.assistantReply).toContain("не называю цену");
    }
  });
});
