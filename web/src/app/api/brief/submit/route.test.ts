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
  });
});
