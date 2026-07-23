import { afterEach, describe, expect, it, vi } from "vitest";

import type { ContactSubmitPayload } from "@/lib/contact-submit";
import { sendTelegramLeadNotification } from "@/lib/telegram-notify";

const originalEnv = { ...process.env };

function createPayload(): ContactSubmitPayload {
  return {
    source: "website_form",
    status: "New",
    name: "Dmitrii",
    phone: "+33 7 80 72 09 94",
    city: "Nice",
    segment: "tpe",
    preferred_contact_language: "en",
    service_type: "site_web",
    problem_description: "We need a new website for our local service business.",
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  process.env = { ...originalEnv };
});

describe("telegram-notify", () => {
  it("includes the validated preferred contact language in the outgoing message", async () => {
    vi.stubEnv("AZURSYSTECH_TELEGRAM_NOTIFICATIONS_ENABLED", "true");
    vi.stubEnv("AZURSYSTECH_TELEGRAM_BOT_TOKEN", "test-token");
    vi.stubEnv("AZURSYSTECH_TELEGRAM_CHAT_ID", "123456");
    vi.stubEnv("AZURSYSTECH_TELEGRAM_API_BASE_URL", "http://127.0.0.1:8787");

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, result: { message_id: 42 } }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendTelegramLeadNotification({
      requestId: "request-1",
      leadId: "lead-1",
      payload: createPayload(),
      integrationOutcome: "stored",
    });

    expect(result).toEqual({ status: "sent", messageId: 42 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(request.body)) as { text: string };
    expect(body.text).toContain("preferred_contact_language: en");
  });
});
