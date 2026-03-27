import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteContent, updateSiteContent } from "@/lib/site-content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "未授權" }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "未授權" }, { status: 401 });
  }
  try {
    const payload = await request.json();
    const content = await updateSiteContent(payload);
    return NextResponse.json({ message: "內容已更新", content });
  } catch {
    return NextResponse.json({ message: "更新失敗" }, { status: 400 });
  }
}
