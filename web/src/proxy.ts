import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LOCALE_STORAGE_KEY } from "./i18n";

const LOCALE_HEADER = "x-azursystech-route-locale";
const ROUTE_LOCALES = new Set(["fr", "ru", "en"]);

const DEFAULT_ALLOWED_ORIGINS = [
  "https://azursystech.fr",
  "https://www.azursystech.fr",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

function getAllowedOrigins(): Set<string> {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  if (!raw) {
    return new Set(DEFAULT_ALLOWED_ORIGINS);
  }

  return new Set(
    raw
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

function withCorsHeaders(response: NextResponse, origin: string, request: NextRequest): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  const requestedHeaders = request.headers.get("access-control-request-headers");
  response.headers.set(
    "Access-Control-Allow-Headers",
    requestedHeaders && requestedHeaders.trim()
      ? requestedHeaders
      : "Content-Type, Authorization, X-Requested-With, X-Request-ID, Idempotency-Key",
  );

  return response;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 1. API routes must always process CORS and handle OPTIONS preflight
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = getAllowedOrigins();

    if (!origin) {
      return NextResponse.next();
    }

    if (!allowedOrigins.has(origin)) {
      return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }

    if (request.method === "OPTIONS") {
      return withCorsHeaders(new NextResponse(null, { status: 204 }), origin, request);
    }

    return withCorsHeaders(NextResponse.next(), origin, request);
  }

  // 2. Locale prefix routes: /fr, /ru, /en
  const firstSeg = pathname.split("/")[1];
  if (ROUTE_LOCALES.has(firstSeg)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, firstSeg);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    if (request.cookies.get(LOCALE_STORAGE_KEY)?.value !== firstSeg) {
      response.cookies.set(LOCALE_STORAGE_KEY, firstSeg, {
        path: "/",
        sameSite: "lax",
        maxAge: 31536000,
      });
    }
    return response;
  }

  // 3. Query-based locale parameter on pages: /brief?locale=en, /legal?locale=en, etc.
  const queryLocale = request.nextUrl.searchParams.get("locale");
  if (queryLocale && ROUTE_LOCALES.has(queryLocale)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, queryLocale);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    if (request.cookies.get(LOCALE_STORAGE_KEY)?.value !== queryLocale) {
      response.cookies.set(LOCALE_STORAGE_KEY, queryLocale, {
        path: "/",
        sameSite: "lax",
        maxAge: 31536000,
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/fr",
    "/fr/:path*",
    "/ru",
    "/ru/:path*",
    "/en",
    "/en/:path*",
    "/brief",
    "/legal",
    "/privacy",
    "/terms",
    "/thank-you",
    "/data-deletion",
    "/ai-automation",
    "/portfolio",
    "/portfolio/:path*",
  ],
};
