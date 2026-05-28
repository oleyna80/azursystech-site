import { describe, expect, it } from "vitest";

import { runIntakeDryRun } from "@/lib/intake/runtime";

const baseMessage = {
  channel: "web_chat" as const,
  conversationKey: "web-chat:1",
  senderKey: "client:1",
  receivedAtUtc: "2026-05-24T10:00:00.000Z",
};

describe("intake runtime", () => {
  it("keeps vague answers in conversation instead of rushing to the contact form", () => {
    const firstDecision = runIntakeDryRun({
      ...baseMessage,
      text: "Здравствуйте",
      locale: "ru",
    });

    expect(firstDecision.action).toBe("ask_followup");
    expect(firstDecision.briefDraft).toMatchObject({
      diagnosticTurnCount: 0,
      contactCtaState: "not_offered",
      nextStep: "clarify",
      missingFields: ["problem_statement"],
    });
    expect(firstDecision.assistantReply).toContain("какой вопрос хотите решить");

    const secondDecision = runIntakeDryRun(
      {
        ...baseMessage,
        receivedAtUtc: "2026-05-24T10:01:00.000Z",
        text: "ничем",
        locale: "ru",
      },
      {
        briefDraft: firstDecision.briefDraft,
      },
    );

    expect(secondDecision.action).toBe("ask_followup");
    expect(secondDecision.briefDraft).toMatchObject({
      diagnosticTurnCount: 0,
      contactCtaState: "not_offered",
      nextStep: "clarify",
    });
    expect(secondDecision.assistantReply).toContain("какой вопрос хотите решить");
  });

  it("keeps generic website chat interest in clarification before routing to a form", () => {
    const decision = runIntakeDryRun(
      {
        ...baseMessage,
        receivedAtUtc: "2026-05-24T10:01:00.000Z",
        text: "Я хочу сайт с чатом как у вас.",
        locale: "ru",
      },
      {
        briefDraft: {
          preferredLanguage: "ru",
          contactCtaState: "not_offered",
          nextStep: "clarify",
        },
      },
    );

    expect(decision.action).toBe("ask_followup");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "not_offered",
      nextStep: "clarify",
      missingFields: ["problem_statement"],
    });
    expect(decision.assistantReply).toContain("какой вопрос хотите решить");
  });

  it("offers contact form only for service/support questions", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "Нужен чат для обслуживания клиентов: отвечать на вопросы и принимать обращения.",
      locale: "ru",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "contact_form",
      missingFields: [],
    });
    expect(decision.assistantReply).toContain("контактной формы");
    expect(decision.assistantReply).toContain("Контакты");
    expect(decision.assistantReply).not.toContain("бриф");
  });

  it("routes local IT service requests like cafe Wi-Fi to the contact form", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "Нет, мне нужно Wi-Fi настроить в кафе. Вы это делаете?",
      locale: "ru",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "contact_form",
      missingFields: [],
    });
    expect(decision.assistantReply).toContain("контактной формы");
    expect(decision.assistantReply).toContain("Контакты");
    expect(decision.assistantReply).not.toContain("бриф");
    expect("adminNotification" in decision).toBe(false);
  });

  it("offers a contact-or-brief choice when the request is clearly automation", () => {
    const decision = runIntakeDryRun({
      ...baseMessage,
      text: "Мы обрабатываем заявки с сайта и Telegram вручную, хотим автоматизировать первичную квалификацию клиентов и передачу менеджеру.",
      locale: "ru",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "brief",
      missingFields: [],
    });
    expect(decision.briefDraft.contactHint).toBeUndefined();
    expect("adminNotification" in decision).toBe(false);
    expect("sheetsMirror" in decision).toBe(false);
    expect(decision.assistantReply).toContain("форму");
    expect(decision.assistantReply).toContain("бриф");
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

  it("keeps the contact form as the next step after follow-up questions", () => {
    const decision = runIntakeDryRun(
      {
        ...baseMessage,
        receivedAtUtc: "2026-05-24T10:02:00.000Z",
        text: "А когда специалист свяжется и сколько займет времени работа?",
        locale: "ru",
      },
      {
        briefDraft: {
          problemStatement: "Я страховой агент, хочу чат для WhatsApp, чтобы отвечать на вопросы и собирать заявки.",
          preferredLanguage: "ru",
          contactCtaState: "offered",
          nextStep: "contact_form",
        },
      },
    );

    expect(decision.action).toBe("ask_followup");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "contact_form",
      missingFields: [],
    });
    expect(decision.assistantReply).toContain("Стоимость и сроки зависят");
    expect(decision.assistantReply).toContain("контактной формы");
    expect(decision.assistantReply).not.toContain("бриф");
    expect("adminNotification" in decision).toBe(false);
  });

  it("moves to optional brief guidance only when the user explicitly asks about the brief", () => {
    const decision = runIntakeDryRun(
      {
        ...baseMessage,
        receivedAtUtc: "2026-05-24T10:02:00.000Z",
        text: "I want help describing what to write in the brief about lead qualification from the site and Telegram.",
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
