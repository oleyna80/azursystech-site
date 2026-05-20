import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE_NAME = "azr_admin_session";
const SCHEDULER_HEADER_NAME = "x-admin-scheduler-secret";
const SCHEDULER_PATHS = new Set(["/api/admin/social/posts/publish-due"]);

type AdminSessionPayload = {
  sub?: unknown;
  exp?: unknown;
};

const textEncoder = new TextEncoder();

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/health" ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  );
}

function base64UrlToBytes(value: string): Uint8Array | null {
  const remainder = value.length % 4;
  const padded = `${value.replace(/-/g, "+").replace(/_/g, "/")}${remainder ? "=".repeat(4 - remainder) : ""}`;

  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

function base64UrlToText(value: string): string | null {
  const bytes = base64UrlToBytes(value);
  if (!bytes) {
    return null;
  }

  try {
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function timingSafeEqualBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
}

async function signPayload(payload: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payload));
  return new Uint8Array(signature);
}

async function timingSafeEqualText(left: string, right: string): Promise<boolean> {
  const leftDigest = await crypto.subtle.digest("SHA-256", textEncoder.encode(`admin:${left}`));
  const rightDigest = await crypto.subtle.digest("SHA-256", textEncoder.encode(`admin:${right}`));
  return timingSafeEqualBytes(new Uint8Array(leftDigest), new Uint8Array(rightDigest));
}

async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!token || !sessionSecret) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [encodedPayload, encodedSignature] = parts;
  if (!encodedPayload || !encodedSignature) {
    return false;
  }

  const signature = base64UrlToBytes(encodedSignature);
  if (!signature) {
    return false;
  }

  try {
    const expectedSignature = await signPayload(encodedPayload, sessionSecret);
    if (!timingSafeEqualBytes(signature, expectedSignature)) {
      return false;
    }

    const payloadText = base64UrlToText(encodedPayload);
    if (!payloadText) {
      return false;
    }

    const payload = JSON.parse(payloadText) as AdminSessionPayload;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.sub === "owner" && typeof payload.exp === "number" && payload.exp > nowSeconds;
  } catch {
    return false;
  }
}

async function isSchedulerCandidate(request: NextRequest, pathname: string): Promise<boolean> {
  if (!SCHEDULER_PATHS.has(pathname)) {
    return false;
  }

  const configuredSecret = process.env.ADMIN_SCHEDULER_SECRET?.trim();
  const candidateSecret = request.headers.get(SCHEDULER_HEADER_NAME)?.trim();
  if (!configuredSecret || !candidateSecret) {
    return false;
  }

  return timingSafeEqualText(candidateSecret, configuredSecret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (await isSchedulerCandidate(request, pathname)) {
    return NextResponse.next();
  }

  if (await verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
