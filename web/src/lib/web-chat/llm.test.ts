import { afterEach, describe, expect, it, vi } from "vitest";

import type { IntakeDecision, NormalizedIntakeMessage } from "@/lib/intake/types";
import { buildWebChatLlmMessages, generateWebChatLlmReply } from "@/lib/web-chat/llm";

const baseMessage: NormalizedIntakeMessage = {
  channel: "web_chat",
  conversationKey: "web-chat:1",
  senderKey: "client:1",
  receivedAtUtc: "2026-05-24T10:00:00.000Z",
  text: "Я заполняю бриф. Что писать в поле про CRM?",
  locale: "ru",
};

const baseDecision: Extract<IntakeDecision, { assistantReply: string }> = {
  action: "ask_followup",
  idempotencyKey: "web_chat:test",
  assistantReply: "Fallback reply.",
  briefDraft: {
    problemStatement: "Нужна автоматизация обработки заявок с сайта и Telegram.",
    preferredLanguage: "ru",
    missingFields: [],
    contactCtaState: "offered",
    nextStep: "brief",
  },
  safety: {
    deflectedCommitment: false,
    detectedContactInChat: false,
    detectedConfidentialInput: false,
    deflectedUnsafeRequest: false,
    duplicateProviderEvent: false,
    sanitizedForLogs: true,
  },
  rateLimit: {
    status: "deferred_to_channel_route",
    key: "web_chat:test",
  },
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("web chat LLM advisory layer", () => {
  it("prioritizes the contact form and blocks brief promotion for contact-form turns", () => {
    const messages = buildWebChatLlmMessages({
      message: {
        ...baseMessage,
        text: "А сколько это будет стоить?",
      },
      decision: {
        ...baseDecision,
        briefDraft: {
          ...baseDecision.briefDraft,
          nextStep: "contact_form",
        },
      },
      history: [],
    });

    expect(messages[0]?.role).toBe("system");
    expect(messages[0]?.content).toContain("Prioritize the contact form link /contact");
    expect(messages[0]?.content).toContain("Do not mention /brief unless the user explicitly asks");
  });

  it("builds expanded sanitized context for brief-form assistance", () => {
    const messages = buildWebChatLlmMessages({
      message: baseMessage,
      decision: baseDecision,
      history: [
        { role: "user", content: "Мой email dmitrii@example.com, хочу автоматизировать заявки." },
        { role: "assistant", content: "Используйте форму для контактов." },
      ],
    });

    expect(messages[0]?.role).toBe("system");
    expect(messages[0]?.content).toContain("optional brief");
    expect(messages[0]?.content).toContain("Help them phrase what to write");
    expect(messages.map((item) => item.content).join("\n")).toContain("[contact]");
    expect(messages.map((item) => item.content).join("\n")).not.toContain("dmitrii@example.com");
  });

  it("returns the provider reply when enabled and output passes safety checks", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  "В поле CRM напишите, какая система используется сейчас и где появляются заявки. Например: сайт, Telegram и таблица, без паролей и токенов.",
              },
            },
          ],
        }),
      })),
    );

    const result = await generateWebChatLlmReply({
      message: baseMessage,
      decision: baseDecision,
      history: [],
    });

    expect(result).toEqual({
      ok: true,
      provider: "deepseek",
      reply:
        "В поле CRM напишите, какая система используется сейчас и где появляются заявки. Например: сайт, Telegram и таблица, без паролей и токенов.",
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.deepseek.com/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          authorization: "Bearer test-key",
        }),
      }),
    );
  });

  it("fails closed on unsafe output instead of returning provider promises", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: "Гарантируем запуск за 3 дня за 500 евро. Пришлите телефон прямо сюда.",
              },
            },
          ],
        }),
      })),
    );

    await expect(
      generateWebChatLlmReply({
        message: baseMessage,
        decision: baseDecision,
        history: [],
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "unsafe_output",
    });
  });
});
