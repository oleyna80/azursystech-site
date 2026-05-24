import { describe, expect, it } from "vitest";

import { runIntakeDryRun } from "@/lib/intake/runtime";

describe("intake runtime", () => {
  it("offers the contact form first when the minimal brief context is complete", () => {
    const decision = runIntakeDryRun({
      channel: "web_chat",
      conversationKey: "web-chat:1",
      senderKey: "client:1",
      receivedAtUtc: "2026-05-24T10:00:00.000Z",
      text: "We need to automate client intake from Telegram and web chat in Nice. Contact me at dmitrii@example.com.",
      locale: "fr",
    });

    expect(decision.action).toBe("ask_followup");
    expect(decision.briefDraft).toMatchObject({
      contactCtaState: "offered",
      nextStep: "contact_form",
      missingFields: [],
    });
    expect("adminNotification" in decision).toBe(false);
    expect("sheetsMirror" in decision).toBe(false);
    expect(decision.assistantReply).toContain("formulaire de contact");
  });

  it("moves toward brief guidance when the contact form was already offered", () => {
    const decision = runIntakeDryRun(
      {
        channel: "web_chat",
        conversationKey: "web-chat:1",
        senderKey: "client:1",
        receivedAtUtc: "2026-05-24T10:01:00.000Z",
        text: "I still have detailed questions about what to write.",
        locale: "fr",
      },
      {
        briefDraft: {
          problemStatement: "We need to automate client intake from Telegram and web chat.",
          contactHint: "dmitrii@example.com",
          city: "Nice",
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
    expect(decision.assistantReply).toContain("revue manuelle");
  });
});
