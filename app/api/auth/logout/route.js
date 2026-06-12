import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/server/session";

export async function POST() {
  return NextResponse.json(
    { ok: true },
    {
      headers: { "Set-Cookie": clearSessionCookie() },
    },
  );
}
