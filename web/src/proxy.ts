import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export const config = {
  matcher: "/api/:path*",
};
