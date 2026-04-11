import { NextResponse } from "next/server";
import { getAdminCookieName, shouldUseSecureAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.json({ message: "已登出" });
  response.cookies.set(getAdminCookieName(), "", {
    httpOnly: true,
    secure: shouldUseSecureAdminCookie(request),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
