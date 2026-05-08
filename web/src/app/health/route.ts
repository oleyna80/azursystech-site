import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ status: "ok" });
  }

  return NextResponse.json({
    status: "ok",
    service: "azursystech-web",
    timestamp: new Date().toISOString(),
  });
}
