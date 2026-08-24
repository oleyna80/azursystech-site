import { afterEach, describe, expect, it, vi } from "vitest";

import { createInitialBriefValues, type BriefFormValues } from "@/lib/brief-submit";

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(() => undefined),
  })),
}));

vi.mock("@/lib/request-rate-limit", () => ({
  isRateLimitedPersistent: vi.fn(async () => false),
}));

vi.mock("@/lib/intake/brief-persistence", () => ({
  IntakeBriefPersistenceUnavailableError: class IntakeBriefPersistenceUnavailableError extends Error {},
  saveIntakeBrief: vi.fn(async () => ({ status: "skipped_legacy" })),
}));

import { IntakeBriefConversationNotFoundError } from "@/lib/intake/briefs";
import { saveIntakeBrief } from "@/lib/intake/brief-persistence";
import { POST } from "./route";

function createValidBriefValues(): BriefFormValues {
  return {
    ...createInitialBriefValues(),
    company_name: "AzurSysTech",
    business_type: "local_service_company",
    target_market: "France",
    main_goal: "Automate website and messenger intake for new service requests.",
    main_problem: "Client requests arrive from several channels and are hard to qualify quickly.",
    desired_result: "Every request should be captured, summarized, and routed for human review.",
    priority_use_case: "messenger_intake",
    current_process_description: "A manager reads each request, asks follow-up questions, and updates a spreadsheet.",
    current_channels: ["website_form", "whatsapp"],
    main_bottleneck: "The first response and qualification steps take too much manual time.",
    human_approval_required: ["price_quote", "deadlines_booking"],
    what_must_not_happen: "The assistant must not promise prices or deadlines without human approval.",
    preferred_start_mode: "pilot_one_process",
    timeline_priority: "2_4_weeks",
    budget_range: "1000_3000",
    contact_name: "Dmitrii",
    contact_email: "dmitrii@example.com",
    preferred_contact_method: "email",
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("POST /api/brief/submit", () => {
  it("returns the brief payload and handoff on successful submission", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOWED_ORIGINS", "https://azursystech.fr");

    const response = await POST(
      new Request("https://azursystech.fr/api/brief/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://azursystech.fr",
        },
        body: JSON.stringify({
          values: createValidBriefValues(),
          locale: "fr",
          ai_assist_used: true,
          assistant_interaction_count: 2.9,
        }),
      }),
    );

    expect(response.status).toBe(200);
    const result = await response.json();

    expect(result).toMatchObject({
      success: true,
      payload: {
        schema_version: "brief.v1",
        source: "brief_form",
        route: "/brief",
        locale: "fr",
        metadata: {
          ai_assist_used: true,
          assistant_interaction_count: 2,
        },
      },
    });
    expect(result.handoff).toEqual(result.payload.crm_handoff);
    expect(result.handoff.contact.email).toBe("dmitrii@example.com");
    expect(saveIntakeBrief).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: expect.stringMatching(/^brief_form:[a-f0-9]{32}$/),
        source: "brief_form",
        status: "submitted",
        locale: "fr",
        payload: result.payload,
        handoff: result.handoff,
        summary: result.handoff.summary,
        metadata: {
          completeness: "form_validated",
          idempotency_source: "backend_derived",
        },
        submittedAtUtc: result.payload.created_at,
      }),
    );
  });

  it("does not persist invalid submissions", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOWED_ORIGINS", "https://azursystech.fr");

    const response = await POST(
      new Request("https://azursystech.fr/api/brief/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://azursystech.fr",
        },
        body: JSON.stringify({
          values: {},
          locale: "fr",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(saveIntakeBrief).not.toHaveBeenCalled();
  });

  it("returns a sanitized client error when linked conversation is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOWED_ORIGINS", "https://azursystech.fr");
    vi.mocked(saveIntakeBrief).mockRejectedValueOnce(
      new IntakeBriefConversationNotFoundError("missing-conversation"),
    );

    const response = await POST(
      new Request("https://azursystech.fr/api/brief/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://azursystech.fr",
        },
        body: JSON.stringify({
          values: createValidBriefValues(),
          locale: "fr",
          conversationId: "missing-conversation",
        }),
      }),
    );

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toMatchObject({
      success: false,
      issues: [{ field: "conversationId" }],
    });
  });

  it("fails visibly when dual SQL brief persistence fails open", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOWED_ORIGINS", "https://azursystech.fr");
    vi.mocked(saveIntakeBrief).mockResolvedValueOnce({ status: "failed_open_dual" });

    const response = await POST(
      new Request("https://azursystech.fr/api/brief/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://azursystech.fr",
        },
        body: JSON.stringify({
          values: createValidBriefValues(),
          locale: "fr",
        }),
      }),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      success: false,
      issues: [{ field: "form" }],
    });
  });

  it("handles English locale submissions with localized responses", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOWED_ORIGINS", "https://azursystech.fr");

    const response = await POST(
      new Request("https://azursystech.fr/api/brief/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://azursystech.fr",
        },
        body: JSON.stringify({
          values: createValidBriefValues(),
          locale: "en",
          ai_assist_used: true,
          assistant_interaction_count: 1,
        }),
      }),
    );

    expect(response.status).toBe(200);
    const result = await response.json();

    expect(result).toMatchObject({
      success: true,
      message: "Your project brief has been received and is ready for manual review.",
      payload: {
        locale: "en",
        metadata: {
          ai_assist_used: true,
          assistant_interaction_count: 1,
        },
      },
      handoff: {
        recommended_next_step: "pilot_discussion",
        business_type: "Local service company",
      },
    });
  });

  it("returns English validation errors for invalid English submissions", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOWED_ORIGINS", "https://azursystech.fr");

    const response = await POST(
      new Request("https://azursystech.fr/api/brief/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://azursystech.fr",
        },
        body: JSON.stringify({
          values: {
            ...createValidBriefValues(),
            company_name: "",
          },
          locale: "en",
        }),
      }),
    );

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.success).toBe(false);
    expect(result.message).toBe("Please check the required fields and submit again.");
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "company_name",
          message: "Please enter your company or project name",
        }),
      ]),
    );
  });
});
