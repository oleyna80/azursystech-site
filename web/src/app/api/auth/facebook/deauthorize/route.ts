import { NextResponse } from "next/server";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Allow: "GET, HEAD, POST, OPTIONS",
} as const;

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

export function GET() {
  return buildDeauthorizeResponse();
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: RESPONSE_HEADERS,
  });
}

export function POST() {
  return buildDeauthorizeResponse();
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: RESPONSE_HEADERS,
  });
}
