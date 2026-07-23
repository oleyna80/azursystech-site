import { describe, expect, it } from "vitest";

import { validateAndBuildContactPayload } from "@/lib/contact-submit";

function createValidFormData(): FormData {
  const formData = new FormData();
  formData.set("name", "Dmitrii");
  formData.set("phone", "+33 7 80 72 09 94");
  formData.set("city", "Nice");
  formData.set("segment", "tpe");
  formData.set("preferred_contact_language", "en");
  formData.set("service_type", "site_web");
  formData.set("problem_description", "We need a new website for our local service business.");
  return formData;
}

describe("contact-submit", () => {
  it("accepts an allowlisted preferred contact language", () => {
    const result = validateAndBuildContactPayload(createValidFormData(), "fr");

    expect(result.kind).toBe("ok");
    if (result.kind === "ok") {
      expect(result.payload.preferred_contact_language).toBe("en");
    }
  });

  it("requires a preferred contact language", () => {
    const formData = createValidFormData();
    formData.delete("preferred_contact_language");

    const result = validateAndBuildContactPayload(formData, "ru");

    expect(result).toMatchObject({
      kind: "validation_error",
      issues: [expect.objectContaining({ field: "preferred_contact_language" })],
    });
  });

  it("rejects a preferred contact language outside the allowlist", () => {
    const formData = createValidFormData();
    formData.set("preferred_contact_language", "de");

    const result = validateAndBuildContactPayload(formData, "fr");

    expect(result).toMatchObject({
      kind: "validation_error",
      issues: [expect.objectContaining({ field: "preferred_contact_language" })],
    });
  });
});
