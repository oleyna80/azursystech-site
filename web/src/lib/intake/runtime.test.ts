import { describe, expect, it } from "vitest";

import { runIntakeDryRun } from "@/lib/intake/runtime";

const baseMessage = {
  channel: "web_chat" as const,
  conversationKey: "web-chat:1",
  senderKey: "client:1",
  receivedAtUtc: "2026-05-24T10:00:00.000Z",
};

describe("intake runtime", () => {
  it("asks one diagnostic question before offering the contact form", () => {
    const firstDecision = runIntakeDryRun({
      ...baseMessage,
      text: "Здравствуйте, хочу AI-автоматизацию.",
      locale: "ru",
    });

    expect(firstDecision.action).toBe("ask_followup");
    expect(firstDecision.briefDraft).toMatchObject({
      diagnosticTurnCount: 1,
      contactCtaState: "not_offered",
      nextStep: "clarify",
      missingFields: ["problem_statement"],
    });
    expect(firstDecision.assistantReply).toContain("Чем занимается ваш бизнес");

    const secondDecision = runIntakeDryRun(
      {
        ...baseMessage,
        receivedAtUtc: "2026-05-24T10:01:00.000Z",
        text: "Пока не знаю, нужно понять что можно автоматизировать.",
        locale: "ru",
      },
      {
        briefDraft: firstDecision.briefDraft,
      },
    );

    expect(secondDecision.action).toBe("ask_followup");
    expect(secondDecision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "contact_form",
    });
    expect(secondDecision.assistantReply).toContain("контактную форму");
  });

  it("offers the contact form before the optional brief when context is useful", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "Мы обрабатываем заявки с сайта и Telegram вручную, хотим автоматизировать первичную квалификацию клиентов и передачу менеджеру.",
      locale: "ru",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "contact_form",
      missingFields: [],
    });
    expect(decision.briefDraft.contactHint).toBeUndefined();
    expect("adminNotification" in decision).toBe(false);
    expect("sheetsMirror" in decision).toBe(false);
    expect(decision.assistantReply).toContain("Если хотите продолжить");
  });

  it("does not collect pasted contact data in chat", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "We need intake automation for website requests. Contact me at dmitrii@example.com.",
      locale: "fr",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.safety.detectedContactInChat).toBe(true);
    expect(decision.briefDraft.contactHint).toBeUndefined();
    expect(decision.briefDraft.problemStatement).toContain("[contact]");
    expect(decision.assistantReply).toContain("formulaire de contact");
    expect(decision.assistantReply).toContain("confidentielles");
  });

  it("treats confidential input as a safety case without notification", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "Вот пароль CRM secret123, подключите AI к заявкам и оплатам.",
      locale: "ru",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.safety.detectedConfidentialInput).toBe(true);
    expect(decision.briefDraft.nextStep).toBe("contact_form");
    expect("adminNotification" in decision).toBe(false);
    expect(decision.assistantReply).toContain("не указывайте в чате");
  });

  it("deflects price and timeline promises", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "Сколько будет стоить и за какие сроки вы сделаете автоматизацию заявок?",
      locale: "ru",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.safety.deflectedCommitment).toBe(true);
    expect(decision.assistantReply).toContain("не называю цену");
  });

  it("deflects unsafe or gray-market requests", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "Нужна серая массовая рассылка и обход блокировок для спама.",
      locale: "ru",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.safety.deflectedUnsafeRequest).toBe(true);
    expect(decision.briefDraft.nextStep).not.toBe("brief");
    expect("adminNotification" in decision).toBe(false);
    expect(decision.assistantReply).toContain("С серыми или нелегальными задачами");
  });

  it("moves to optional brief guidance only after the contact form was already offered", () => {
    const decision = runIntakeDryRun(
      {
        ...baseMessage,
        receivedAtUtc: "2026-05-24T10:02:00.000Z",
        text: "I want help describing how the assistant should qualify leads from the site and Telegram.",
        locale: "fr",
      },
      {
        briefDraft: {
          problemStatement: "We need to automate client intake from Telegram and web chat.",
          preferredLanguage: "fr",
          contactCtaState: "offered",
          nextStep: "contact_form",
        },
      },
    );

    expect(decision.action).toBe("mark_brief_ready");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "brief",
      missingFields: [],
    });
    expect(decision.assistantReply).toContain("brief optionnel");
    expect("adminNotification" in decision).toBe(true);
  });
});
