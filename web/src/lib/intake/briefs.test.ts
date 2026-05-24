import { describe, expect, it } from "vitest";

import { createInitialBriefValues } from "@/lib/brief-submit";
import {
  buildAgentBriefIdempotencyKey,
  buildBriefFormIdempotencyKey,
  buildIntakeBriefDraftSnapshot,
} from "@/lib/intake/briefs";

describe("intake brief helpers", () => {
  it("builds a stable backend-derived key for brief form retries in the same window", () => {
    const values = {
      ...createInitialBriefValues(),
      company_name: "AzurSysTech",
      main_goal: "Automate intake",
    };
    const now = new Date("2026-05-24T10:04:00.000Z");

    expect(
      buildBriefFormIdempotencyKey({
        values,
        locale: "fr",
        conversationId: "web_chat:conversation-1",
        now,
      }),
    ).toBe(
      buildBriefFormIdempotencyKey({
        values,
        locale: "fr",
        conversationId: "web_chat:conversation-1",
        now: new Date("2026-05-24T10:09:59.000Z"),
      }),
    );
  });

  it("separates agent draft idempotency from the inbound decision key", () => {
    expect(
      buildAgentBriefIdempotencyKey({
        channel: "telegram",
        conversationKey: "chat-1",
        decisionIdempotencyKey: "telegram:update-1",
      }),
    ).toMatch(/^telegram:brief_ready:[a-f0-9]{32}$/);
  });

  it("keeps agent-created snapshots smaller than submitted brief payloads", () => {
    expect(
      buildIntakeBriefDraftSnapshot({
        problemStatement: "Client wants to automate intake.",
        contactHint: "dmitrii@example.com",
        city: "Nice",
        preferredLanguage: "fr",
        missingFields: [],
        contactCtaState: "offered",
        nextStep: "contact_form",
      }),
    ).toEqual({
      problemStatement: "Client wants to automate intake.",
      contactHint: "dmitrii@example.com",
      city: "Nice",
      preferredLanguage: "fr",
      missingFields: [],
    });
  });
});
