import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { getAdminAuthConfig } from "@/lib/auth/config";
import type { AdminSessionPayload } from "@/lib/auth/session";

export const ADMIN_CSRF_COOKIE_NAME = "azr_admin_csrf";
export const ADMIN_CSRF_HEADER_NAME = "x-csrf-token";

function signCsrf(session: AdminSessionPayload): string {
  const config = getAdminAuthConfig();
  return crypto
    .createHmac("sha256", config.sessionSecret)
    .update(`csrf:${session.jti}:${session.exp}`)
    .digest("base64url");
}

function timingSafeEqualText(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValueParts] = part.trim().split("=");
    const rawValue = rawValueParts.join("=");

    if (rawName === name && rawValue) {
      return decodeURIComponent(rawValue);
    }
  }

  return null;
}

export function createCsrfToken(session: AdminSessionPayload): string {
  return signCsrf(session);
}

export function isValidCsrfToken(token: string | null | undefined, session: AdminSessionPayload): boolean {
  if (!token) {
    return false;
  }

  return timingSafeEqualText(token, signCsrf(session));
}

export function isValidCsrfRequest(request: Request, session: AdminSessionPayload): boolean {
  const expectedToken = signCsrf(session);
  const headerToken = request.headers.get(ADMIN_CSRF_HEADER_NAME);
  const cookieToken = getCookieValue(request, ADMIN_CSRF_COOKIE_NAME);

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return false;
  }

  return timingSafeEqualText(headerToken, expectedToken);
}

export function setCsrfCookie(response: NextResponse, session: AdminSessionPayload): void {
  const config = getAdminAuthConfig();
  response.cookies.set(ADMIN_CSRF_COOKIE_NAME, createCsrfToken(session), {
    httpOnly: false,
    maxAge: config.sessionTtlSeconds,
    path: "/",
    sameSite: "lax",
    secure: config.isProduction,
  });
}

export function clearCsrfCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_CSRF_COOKIE_NAME, "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
