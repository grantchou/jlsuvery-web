import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "jlsuvery_admin_session";

/** 依實際連線是否為 HTTPS 決定 Cookie 的 Secure，避免 production + http 時瀏覽器拒絕寫入 Session。 */
export function shouldUseSecureAdminCookie(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) {
    const proto = forwarded.split(",")[0]?.trim().toLowerCase();
    if (proto === "http" || proto === "https") {
      return proto === "https";
    }
  }
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? "").trim();
}

function getSessionSecret(): string {
  return (process.env.ADMIN_SESSION_SECRET ?? "").trim();
}

export function isAdminEnvConfigured(): boolean {
  return Boolean(getAdminPassword() && getSessionSecret());
}

function signSessionPayload(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  const candidate = password.trim();
  if (!expected || !candidate) {
    return false;
  }
  return safeCompare(candidate, expected);
}

export function createSessionToken(): string {
  const expiresAt = (Date.now() + 1000 * 60 * 60 * 12).toString();
  const signature = signSessionPayload(expiresAt);
  return `${expiresAt}.${signature}`;
}

export function isValidSessionToken(token: string): boolean {
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) {
    return false;
  }
  if (Date.now() > Number(expiresAt)) {
    return false;
  }
  const expected = signSessionPayload(expiresAt);
  return safeCompare(signature, expected);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !isAdminEnvConfigured()) {
    return false;
  }
  return isValidSessionToken(token);
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE;
}
