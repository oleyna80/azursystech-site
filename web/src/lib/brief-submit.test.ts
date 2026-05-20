import { describe, expect, it } from "vitest";

import {
  buildBriefSubmissionPayload,
  createBriefHandoff,
  createInitialBriefValues,
  validateBriefValues,
  type BriefFormValues,
} from "@/lib/brief-submit";

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

describe("brief-submit", () => {
  it("accepts a complete brief and returns normalized values", () => {
    const result = validateBriefValues(createValidBriefValues(), "fr");

    expect(result.kind).toBe("ok");
    if (result.kind === "ok") {
      expect(result.values.company_name).toBe("AzurSysTech");
      expect(result.values.current_channels).toEqual(["website_form", "whatsapp"]);
    }
  });

  it("returns field-level issues for invalid required fields", () => {
    const result = validateBriefValues(
      {
        ...createValidBriefValues(),
        company_name: "",
        business_type: "other",
        business_type_other: "",
        contact_email: "not-an-email",
      },
      "fr",
    );

    expect(result.kind).toBe("validation_error");
    if (result.kind === "validation_error") {
      expect(result.issues.map((issue) => issue.field)).toEqual(
        expect.arrayContaining(["company_name", "business_type_other", "contact_email"]),
      );
    }
  });

  it("builds handoff labels and recommended next step from brief values", () => {
    const handoff = createBriefHandoff(createValidBriefValues(), "fr");

    expect(handoff.recommended_next_step).toBe("pilot_discussion");
    expect(handoff.contact).toMatchObject({
      name: "Dmitrii",
      email: "dmitrii@example.com",
      preferred_contact_method: "Email",
    });
    expect(handoff.summary).toContain("AzurSysTech");
  });

  it("builds stable submission metadata defaults and clamps interaction count", () => {
    const payload = buildBriefSubmissionPayload(
      createValidBriefValues(),
      {
        ai_assist_used: true,
        assistant_interaction_count: -3.4,
        created_at: "2026-05-19T20:00:00.000Z",
      },
      "fr",
    );

    expect(payload).toMatchObject({
      schema_version: "brief.v1",
      source: "brief_form",
      route: "/brief",
      locale: "fr",
      created_at: "2026-05-19T20:00:00.000Z",
      metadata: {
        ai_assist_used: true,
        assistant_interaction_count: 0,
      },
    });
    expect(payload.crm_handoff).toEqual(createBriefHandoff(payload.brief, "fr"));
  });
});
