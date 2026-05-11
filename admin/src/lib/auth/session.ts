import crypto from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAdminAuthConfig } from "@/lib/auth/config";

export const ADMIN_SESSION_COOKIE_NAME = "azr_admin_session";

export type AdminSessionPayload = {
  sub: "owner";
  iat: number;
  exp: number;
  jti: string;
};

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string): Buffer {
  return Buffer.from(value, "base64url");
}

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function parseCookieHeader(cookieHeader: string | null): Map<string, string> {
  const result = new Map<string, string>();

  if (!cookieHeader) {
    return result;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValueParts] = part.trim().split("=");
    const rawValue = rawValueParts.join("=");

    if (!rawName || !rawValue) {
      continue;
    }

    result.set(rawName, decodeURIComponent(rawValue));
  }

  return result;
}

export function createAdminSessionToken(nowSeconds = Math.floor(Date.now() / 1000)): {
  payload: AdminSessionPayload;
  token: string;
} {
  const config = getAdminAuthConfig();
  const payload: AdminSessionPayload = {
    sub: "owner",
    iat: nowSeconds,
    exp: nowSeconds + config.sessionTtlSeconds,
    jti: crypto.randomUUID(),
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, config.sessionSecret);

  return {
    payload,
    token: `${encodedPayload}.${signature}`,
  };
}

export function verifyAdminSessionToken(token: string | undefined | null): AdminSessionPayload | null {
  if (!token) {
    return null;
  }

  try {
    const config = getAdminAuthConfig();
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = signPayload(encodedPayload, config.sessionSecret);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8")) as AdminSessionPayload;
    const nowSeconds = Math.floor(Date.now() / 1000);

    if (payload.sub !== "owner" || !payload.exp || payload.exp <= nowSeconds) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionFromRequest(request: Request): AdminSessionPayload | null {
  const cookieMap = parseCookieHeader(request.headers.get("cookie"));
  return verifyAdminSessionToken(cookieMap.get(ADMIN_SESSION_COOKIE_NAME));
}

export async function getAdminSessionFromCookieStore(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value);
}

export function setAdminSessionCookie(response: NextResponse, token: string): void {
  const config = getAdminAuthConfig();
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: config.sessionTtlSeconds,
    path: "/",
    sameSite: "lax",
    secure: config.isProduction,
  });
}
export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
