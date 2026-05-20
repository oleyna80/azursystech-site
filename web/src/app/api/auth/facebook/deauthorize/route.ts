import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { readFormDataWithLimit } from "@/lib/api-security";

const MAX_DEAUTHORIZE_BODY_BYTES = 16_384;

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Allow: "POST, OPTIONS",
} as const;

function getFacebookAppSecret(): string | null {
  return process.env.META_APP_SECRET?.trim() || process.env.FACEBOOK_APP_SECRET?.trim() || null;
}

function timingSafeEqualText(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifySignedRequest(signedRequest: string): boolean {
  const appSecret = getFacebookAppSecret();
  if (!appSecret) {
    return false;
  }

  const parts = signedRequest.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [encodedSignature, encodedPayload] = parts;
  if (!encodedSignature || !encodedPayload) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", appSecret)
      .update(encodedPayload)
      .digest("base64url");
    if (!timingSafeEqualText(encodedSignature, expectedSignature)) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      algorithm?: unknown;
      user_id?: unknown;
    };

    return payload.algorithm === "HMAC-SHA256" && typeof payload.user_id === "string";
  } catch {
    return false;
  }
}

function buildDeauthorizeResponse() {
  return NextResponse.json(
    {
      status: "ok",
      callback: "facebook_deauthorize",
    },
    {
      status: 200,
      headers: RESPONSE_HEADERS,
    },
  );
}

function methodNotAllowedResponse() {
  return NextResponse.json(
    { error: "method_not_allowed" },
    { status: 405, headers: RESPONSE_HEADERS },
  );
}

export function GET() {
  return methodNotAllowedResponse();
}

export function HEAD() {
  return new Response(null, {
    status: 405,
    headers: RESPONSE_HEADERS,
  });
}

export async function POST(request: Request) {
  if (!getFacebookAppSecret()) {
    return NextResponse.json(
      { error: "facebook_app_secret_not_configured" },
      { status: 503, headers: RESPONSE_HEADERS },
    );
  }

  const parsedForm = await readFormDataWithLimit(request, MAX_DEAUTHORIZE_BODY_BYTES);
  if (!parsedForm.ok) {
    if (parsedForm.reason === "too_large") {
      return NextResponse.json({ error: "request_too_large" }, { status: 413, headers: RESPONSE_HEADERS });
    }
    return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: RESPONSE_HEADERS });
  }

  const signedRequest = parsedForm.value.get("signed_request");
  if (typeof signedRequest !== "string" || !verifySignedRequest(signedRequest)) {
    return NextResponse.json(
      { error: "invalid_signed_request" },
      { status: 400, headers: RESPONSE_HEADERS },
    );
  }

  return buildDeauthorizeResponse();
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: RESPONSE_HEADERS,
  });
}
