import type { ContactSubmitPayload } from "@/lib/contact-submit";

const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_REQUEST_TIMEOUT_MS = 10_000;

export type ResendConfig = {
  apiKey: string;
  fromEmail: string;
  adminEmail: string;
};

export type ResendConfigResolution =
  | { kind: "disabled" }
  | { kind: "invalid"; error: "missing_credentials" }
  | { kind: "ready"; config: ResendConfig };

export type ResendEmailResult =
  | { status: "sent"; emailId: string | null }
  | { status: "skipped"; reason: "disabled" | "no_client_email" }
  | { status: "failed"; error: string; httpStatus?: number };

export type ResendAdminNotificationInput = {
  requestId: string;
  leadId: string | null;
  payload: ContactSubmitPayload;
  integrationOutcome?: string;
};

export type ResendClientConfirmationInput = {
  requestId?: string;
  leadId?: string | null;
  payload: ContactSubmitPayload;
};

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function resolveResendConfig(): ResendConfigResolution {
  const enabled = process.env.AZURSYSTECH_RESEND_EMAIL_ENABLED?.trim() === "true";
  if (!enabled) {
    return { kind: "disabled" };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const adminEmail = process.env.AZURSYSTECH_ADMIN_EMAIL?.trim();

  if (!apiKey || !fromEmail || !adminEmail) {
    return { kind: "invalid", error: "missing_credentials" };
  }

  return {
    kind: "ready",
    config: {
      apiKey,
      fromEmail,
      adminEmail,
    },
  };
}

async function postResendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<ResendEmailResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject: params.subject,
        text: params.text,
        html: params.html,
      }),
      signal: controller.signal,
    });

    let responseBody: unknown = null;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }

    if (!response.ok) {
      let errorMessage = "http_error";
      if (
        responseBody &&
        typeof responseBody === "object" &&
        "message" in responseBody &&
        typeof responseBody.message === "string"
      ) {
        errorMessage = responseBody.message;
      }
      return { status: "failed", error: errorMessage, httpStatus: response.status };
    }

    const emailId =
      responseBody &&
      typeof responseBody === "object" &&
      "id" in responseBody &&
      typeof responseBody.id === "string"
        ? responseBody.id
        : null;

    return { status: "sent", emailId };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { status: "failed", error: "timeout" };
    }
    const errorMessage = error instanceof Error ? error.message : "network_error";
    return { status: "failed", error: errorMessage };
  } finally {
    clearTimeout(timeout);
  }
}

function buildAdminEmailText(input: ResendAdminNotificationInput): string {
  const { requestId, leadId, payload, integrationOutcome } = input;
  return [
    "New Lead Received - AzurSysTech",
    `Request ID: ${requestId}`,
    `Lead ID: ${leadId ?? "N/A"}`,
    `Source: ${payload.source}`,
    `Status: ${payload.status}`,
    `Segment: ${payload.segment}`,
    `Preferred Language: ${payload.preferred_contact_language}`,
    `Service Type: ${payload.service_type}`,
    `Urgency: ${payload.urgency ?? "not_provided"}`,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email ?? "not_provided"}`,
    `City: ${payload.city}`,
    ...(integrationOutcome ? [`Integration: ${integrationOutcome}`] : []),
    "",
    "Problem Description:",
    payload.problem_description,
  ].join("\n");
}

function buildAdminEmailHtml(input: ResendAdminNotificationInput): string {
  const { requestId, leadId, payload, integrationOutcome } = input;
  return [
    `<h2>New Lead Received - AzurSysTech</h2>`,
    `<p><strong>Request ID:</strong> ${escapeHtml(requestId)}</p>`,
    `<p><strong>Lead ID:</strong> ${escapeHtml(leadId ?? "N/A")}</p>`,
    `<ul>`,
    `  <li><strong>Name:</strong> ${escapeHtml(payload.name)}</li>`,
    `  <li><strong>Phone:</strong> ${escapeHtml(payload.phone)}</li>`,
    `  <li><strong>Email:</strong> ${escapeHtml(payload.email ?? "Not provided")}</li>`,
    `  <li><strong>City:</strong> ${escapeHtml(payload.city)}</li>`,
    `  <li><strong>Segment:</strong> ${escapeHtml(payload.segment)}</li>`,
    `  <li><strong>Preferred Language:</strong> ${escapeHtml(payload.preferred_contact_language)}</li>`,
    `  <li><strong>Service Type:</strong> ${escapeHtml(payload.service_type)}</li>`,
    `  <li><strong>Urgency:</strong> ${escapeHtml(payload.urgency ?? "not_provided")}</li>`,
    ...(integrationOutcome ? [`  <li><strong>Integration:</strong> ${escapeHtml(integrationOutcome)}</li>`] : []),
    `</ul>`,
    `<p><strong>Problem Description:</strong></p>`,
    `<blockquote style="white-space: pre-wrap;">${escapeHtml(payload.problem_description)}</blockquote>`,
  ].join("\n");
}

function buildClientEmailContent(payload: ContactSubmitPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const lang = payload.preferred_contact_language || "fr";
  const name = payload.name;
  const service = payload.service_type;
  const phone = payload.phone;

  switch (lang) {
    case "ru": {
      const subject = "AzurSysTech - Подтверждение вашей заявки";
      const text = [
        `Здравствуйте, ${name}!`,
        "",
        `Мы получили вашу заявку по услуге "${service}".`,
        `Наша команда свяжется с вами в ближайшее время по телефону ${phone}.`,
        "",
        "Спасибо за обращение,",
        "Команда AzurSysTech",
        "https://azursystech.fr",
      ].join("\n");

      const html = [
        `<h2>Здравствуйте, ${escapeHtml(name)}!</h2>`,
        `<p>Мы получили вашу заявку по услуге <strong>${escapeHtml(service)}</strong>.</p>`,
        `<p>Наша команда свяжется с вами в ближайшее время по телефону <strong>${escapeHtml(phone)}</strong>.</p>`,
        `<p>Спасибо за обращение,<br/><strong>Команда AzurSysTech</strong></p>`,
        `<p><a href="https://azursystech.fr">azursystech.fr</a></p>`,
      ].join("\n");

      return { subject, text, html };
    }

    case "en": {
      const subject = "AzurSysTech - Confirmation of your request";
      const text = [
        `Hello ${name},`,
        "",
        `We have received your request regarding "${service}".`,
        `Our team will contact you shortly at ${phone}.`,
        "",
        "Thank you for reaching out,",
        "The AzurSysTech Team",
        "https://azursystech.fr",
      ].join("\n");

      const html = [
        `<h2>Hello ${escapeHtml(name)},</h2>`,
        `<p>We have received your request regarding <strong>${escapeHtml(service)}</strong>.</p>`,
        `<p>Our team will contact you shortly at <strong>${escapeHtml(phone)}</strong>.</p>`,
        `<p>Thank you for reaching out,<br/><strong>The AzurSysTech Team</strong></p>`,
        `<p><a href="https://azursystech.fr">azursystech.fr</a></p>`,
      ].join("\n");

      return { subject, text, html };
    }

    case "fr":
    default: {
      const subject = "AzurSysTech - Confirmation de votre demande";
      const text = [
        `Bonjour ${name},`,
        "",
        `Nous avons bien reçu votre demande concernant "${service}".`,
        `Notre équipe vous contactera dans les plus brefs délais au ${phone}.`,
        "",
        "Merci de votre confiance,",
        "L'équipe AzurSysTech",
        "https://azursystech.fr",
      ].join("\n");

      const html = [
        `<h2>Bonjour ${escapeHtml(name)},</h2>`,
        `<p>Nous avons bien reçu votre demande concernant <strong>${escapeHtml(service)}</strong>.</p>`,
        `<p>Notre équipe vous contactera dans les plus brefs délais au <strong>${escapeHtml(phone)}</strong>.</p>`,
        `<p>Merci de votre confiance,<br/><strong>L'équipe AzurSysTech</strong></p>`,
        `<p><a href="https://azursystech.fr">azursystech.fr</a></p>`,
      ].join("\n");

      return { subject, text, html };
    }
  }
}

export async function sendResendAdminNotification(
  input: ResendAdminNotificationInput,
): Promise<ResendEmailResult> {
  const configRes = resolveResendConfig();
  if (configRes.kind === "disabled") {
    return { status: "skipped", reason: "disabled" };
  }
  if (configRes.kind === "invalid") {
    return { status: "failed", error: configRes.error };
  }

  const { apiKey, fromEmail, adminEmail } = configRes.config;
  const subject = `New Lead: ${input.payload.name} - ${input.payload.service_type}`;
  const text = buildAdminEmailText(input);
  const html = buildAdminEmailHtml(input);

  return postResendEmail({
    apiKey,
    from: fromEmail,
    to: adminEmail,
    subject,
    text,
    html,
  });
}

export async function sendResendClientConfirmation(
  input: ResendClientConfirmationInput,
): Promise<ResendEmailResult> {
  const clientEmail = input.payload.email?.trim();
  if (!clientEmail) {
    return { status: "skipped", reason: "no_client_email" };
  }

  const configRes = resolveResendConfig();
  if (configRes.kind === "disabled") {
    return { status: "skipped", reason: "disabled" };
  }
  if (configRes.kind === "invalid") {
    return { status: "failed", error: configRes.error };
  }

  const { apiKey, fromEmail } = configRes.config;
  const { subject, text, html } = buildClientEmailContent(input.payload);

  return postResendEmail({
    apiKey,
    from: fromEmail,
    to: clientEmail,
    subject,
    text,
    html,
  });
}
