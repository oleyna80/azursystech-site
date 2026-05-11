import crypto from "node:crypto";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { getAdminAuthConfig } from "@/lib/auth/config";
import { isValidCsrfRequest } from "@/lib/auth/csrf";
import {
  getAdminSessionFromCookieStore,
  getAdminSessionFromRequest,
  type AdminSessionPayload,
} from "@/lib/auth/session";

type AdminOwnerAuth = { ok: true; actor: "owner"; session: AdminSessionPayload };
type AdminSchedulerAuth = { ok: true; actor: "scheduler"; session: null };
type AdminFailedAuth = { ok: false; response: NextResponse };

export type AdminRequestAuth = AdminOwnerAuth | AdminSchedulerAuth | AdminFailedAuth;

function authUnavailableResponse(): NextResponse {
  return NextResponse.json({ error: "admin_auth_unavailable" }, { status: 503 });
}

function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function csrfResponse(): NextResponse {
  return NextResponse.json({ error: "csrf_failed" }, { status: 403 });
}

function timingSafeEqualText(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export async function requireAdminPage(): Promise<AdminSessionPayload> {
  try {
    getAdminAuthConfig();
  } catch {
    redirect("/login?error=not_configured");
  }

  const session = await getAdminSessionFromCookieStore();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export function requireAdminRequest(request: Request): AdminOwnerAuth | AdminFailedAuth {
  try {
    getAdminAuthConfig();
  } catch {
    return { ok: false, response: authUnavailableResponse() };
  }

  const session = getAdminSessionFromRequest(request);

  if (!session) {
    return { ok: false, response: unauthorizedResponse() };
  }

  return { ok: true, actor: "owner", session };
}

export function requireAdminMutationRequest(request: Request): AdminOwnerAuth | AdminFailedAuth {
  const auth = requireAdminRequest(request);

  if (!auth.ok) {
    return auth;
  }

  if (!isValidCsrfRequest(request, auth.session)) {
    return { ok: false, response: csrfResponse() };
  }

  return auth;
}

export function requireAdminOrSchedulerRequest(request: Request): AdminRequestAuth {
  try {
    const config = getAdminAuthConfig();
    const schedulerSecret = request.headers.get("x-admin-scheduler-secret");

    if (
      config.schedulerSecret &&
      schedulerSecret &&
      timingSafeEqualText(schedulerSecret, config.schedulerSecret)
    ) {
      return { ok: true, actor: "scheduler", session: null };
    }
  } catch {
    return { ok: false, response: authUnavailableResponse() };
  }

  return requireAdminMutationRequest(request);
}
