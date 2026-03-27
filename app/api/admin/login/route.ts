import { NextResponse } from "next/server";
import { createSessionToken, getAdminCookieName, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    if (!process.env.ADMIN_SESSION_SECRET || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ message: "後台尚未設定環境變數" }, { status: 500 });
    }

    const payload = (await request.json()) as { password?: string };
    if (!verifyAdminPassword(payload.password ?? "")) {
      return NextResponse.json({ message: "密碼錯誤" }, { status: 401 });
    }

    const response = NextResponse.json({ message: "登入成功" });
    response.cookies.set(getAdminCookieName(), createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ message: "登入失敗，請稍後再試" }, { status: 500 });
  }
}
