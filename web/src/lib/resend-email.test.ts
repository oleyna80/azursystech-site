import { afterEach, describe, expect, it, vi } from "vitest";
import type { ContactSubmitPayload } from "@/lib/contact-submit";
import {
  escapeHtml,
  resolveResendConfig,
  sendResendAdminNotification,
  sendResendClientConfirmation,
} from "@/lib/resend-email";

const originalEnv = { ...process.env };

function createTestPayload(overrides?: Partial<ContactSubmitPayload>): ContactSubmitPayload {
  return {
    source: "website_form",
    status: "New",
    name: "John Doe",
    phone: "+33612345678",
    email: "client@example.com",
    city: "Nice",
    segment: "tpe",
    preferred_contact_language: "fr",
    service_type: "site_web",
    problem_description: "Need a modern responsive website <script>alert(1)</script>.",
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  process.env = { ...originalEnv };
});

describe("resend-email", () => {
  describe("escapeHtml", () => {
    it("escapes special HTML characters properly", () => {
      const input = `<script>alert("xss" & 'test')</script>`;
      const expected = `&lt;script&gt;alert(&quot;xss&quot; &amp; &#39;test&#39;)&lt;/script&gt;`;
      expect(escapeHtml(input)).toBe(expected);
    });

    it("returns plain strings unmodified", () => {
      expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
    });
  });

  describe("resolveResendConfig", () => {
    it("returns disabled when AZURSYSTECH_RESEND_EMAIL_ENABLED is not 'true'", () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "false");
      expect(resolveResendConfig()).toEqual({ kind: "disabled" });

      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "");
      expect(resolveResendConfig()).toEqual({ kind: "disabled" });
    });

    it("returns invalid missing_credentials when required env vars are absent", () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "");
      vi.stubEnv("RESEND_FROM_EMAIL", "notifications@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      expect(resolveResendConfig()).toEqual({
        kind: "invalid",
        error: "missing_credentials",
      });
    });

    it("returns ready with config when all required env vars are present", () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "re_test_key_123");
      vi.stubEnv("RESEND_FROM_EMAIL", "notifications@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      expect(resolveResendConfig()).toEqual({
        kind: "ready",
        config: {
          apiKey: "re_test_key_123",
          fromEmail: "notifications@azursystech.fr",
          adminEmail: "admin@azursystech.fr",
        },
      });
    });
  });

  describe("sendResendAdminNotification", () => {
    it("returns skipped when disabled", async () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "false");
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      const result = await sendResendAdminNotification({
        requestId: "req-1",
        leadId: "lead-1",
        payload: createTestPayload(),
      });

      expect(result).toEqual({ status: "skipped", reason: "disabled" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sends lead summary to admin email when configured", async () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      vi.stubEnv("RESEND_FROM_EMAIL", "from@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: "resend_msg_001" }), { status: 200 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const result = await sendResendAdminNotification({
        requestId: "req-1",
        leadId: "lead-1",
        payload: createTestPayload(),
        integrationOutcome: "accepted",
      });

      expect(result).toEqual({ status: "sent", emailId: "resend_msg_001" });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe("https://api.resend.com/emails");
      expect(options.headers).toMatchObject({
        Authorization: "Bearer re_test_123",
        "Content-Type": "application/json",
      });

      const body = JSON.parse(String(options.body));
      expect(body.from).toBe("from@azursystech.fr");
      expect(body.to).toEqual(["admin@azursystech.fr"]);
      expect(body.subject).toContain("John Doe");
      expect(body.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(body.text).toContain("Need a modern responsive website");
    });

    it("returns failed when Resend API returns non-200 status", async () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      vi.stubEnv("RESEND_FROM_EMAIL", "from@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Invalid API Key" }), { status: 401 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const result = await sendResendAdminNotification({
        requestId: "req-1",
        leadId: "lead-1",
        payload: createTestPayload(),
      });

      expect(result).toEqual({
        status: "failed",
        error: "Invalid API Key",
        httpStatus: 401,
      });
    });
  });

  describe("sendResendClientConfirmation", () => {
    it("returns skipped with reason no_client_email when email is missing or empty", async () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      vi.stubEnv("RESEND_FROM_EMAIL", "from@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      const payloadWithoutEmail = createTestPayload({ email: undefined });
      const result = await sendResendClientConfirmation({ payload: payloadWithoutEmail });

      expect(result).toEqual({ status: "skipped", reason: "no_client_email" });
      expect(fetchMock).not.toHaveBeenCalled();

      const payloadWithEmptyEmail = createTestPayload({ email: "   " });
      const result2 = await sendResendClientConfirmation({ payload: payloadWithEmptyEmail });
      expect(result2).toEqual({ status: "skipped", reason: "no_client_email" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sends localized email for FR locale", async () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      vi.stubEnv("RESEND_FROM_EMAIL", "from@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: "client_msg_fr" }), { status: 200 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const payload = createTestPayload({ preferred_contact_language: "fr" });
      const result = await sendResendClientConfirmation({ payload });

      expect(result).toEqual({ status: "sent", emailId: "client_msg_fr" });
      const body = JSON.parse(String((fetchMock.mock.calls[0]?.[1] as RequestInit).body));
      expect(body.to).toEqual(["client@example.com"]);
      expect(body.subject).toContain("Confirmation de votre demande");
      expect(body.text).toContain("Bonjour John Doe,");
      expect(body.html).toContain("Bonjour John Doe,");
    });

    it("sends localized email for EN locale", async () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      vi.stubEnv("RESEND_FROM_EMAIL", "from@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: "client_msg_en" }), { status: 200 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const payload = createTestPayload({ preferred_contact_language: "en" });
      const result = await sendResendClientConfirmation({ payload });

      expect(result).toEqual({ status: "sent", emailId: "client_msg_en" });
      const body = JSON.parse(String((fetchMock.mock.calls[0]?.[1] as RequestInit).body));
      expect(body.subject).toContain("Confirmation of your request");
      expect(body.text).toContain("Hello John Doe,");
      expect(body.html).toContain("Hello John Doe,");
    });

    it("sends localized email for RU locale", async () => {
      vi.stubEnv("AZURSYSTECH_RESEND_EMAIL_ENABLED", "true");
      vi.stubEnv("RESEND_API_KEY", "re_test_123");
      vi.stubEnv("RESEND_FROM_EMAIL", "from@azursystech.fr");
      vi.stubEnv("AZURSYSTECH_ADMIN_EMAIL", "admin@azursystech.fr");

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: "client_msg_ru" }), { status: 200 }),
      );
      vi.stubGlobal("fetch", fetchMock);

      const payload = createTestPayload({ preferred_contact_language: "ru" });
      const result = await sendResendClientConfirmation({ payload });

      expect(result).toEqual({ status: "sent", emailId: "client_msg_ru" });
      const body = JSON.parse(String((fetchMock.mock.calls[0]?.[1] as RequestInit).body));
      expect(body.subject).toContain("Подтверждение вашей заявки");
      expect(body.text).toContain("Здравствуйте, John Doe!");
      expect(body.html).toContain("Здравствуйте, John Doe!");
    });
  });
});
