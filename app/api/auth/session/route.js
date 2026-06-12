import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/server/session";

export async function GET(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await verifySessionToken(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
