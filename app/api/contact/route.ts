import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactMail } from "@/lib/mailer";
import { contactSchema } from "@/lib/validators/contact";

const REQUEST_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MIN_INTERVAL_MS = 15_000;
const requestLog = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const entries = requestLog.get(ip) ?? [];
  const recentEntries = entries.filter((timestamp) => now - timestamp <= REQUEST_WINDOW_MS);
  const lastRequest = recentEntries[recentEntries.length - 1];
  if (lastRequest && now - lastRequest < MIN_INTERVAL_MS) {
    requestLog.set(ip, [...recentEntries, now]);
    return true;
  }
  if (recentEntries.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(ip, [...recentEntries, now]);
    return true;
  }
  requestLog.set(ip, [...recentEntries, now]);
  return false;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          message: firstIssue?.message ?? "表單欄位驗證失敗",
          field: firstIssue?.path?.[0] ?? null,
        },
        { status: 400 },
      );
    }

    const clientIp = getClientIp(request);
    const now = Date.now();
    if (isRateLimited(clientIp, now)) {
      return NextResponse.json(
        { message: "送出太頻繁，請稍後再試。" },
        { status: 429 },
      );
    }

    if (parsed.data.hp) {
      return NextResponse.json({ message: "已收到您的需求。" }, { status: 200 });
    }

    await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        source: "website",
        ipAddress: clientIp,
      },
    });

    try {
      await sendContactMail(parsed.data);
    } catch (mailError) {
      console.error("寄信失敗", mailError);
    }

    return NextResponse.json({ message: "已收到您的需求，我們會儘快與您聯繫。" });
  } catch (error) {
    console.error("聯絡表單處理失敗", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "資料儲存失敗，請稍後再試。" },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "系統錯誤，請稍後再試。" }, { status: 500 });
  }
}
