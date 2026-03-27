import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "jlsuvery_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
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
  if (!expected || !password) {
    return false;
  }
  return safeCompare(password, expected);
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
  if (!token || !getSessionSecret()) {
    return false;
  }
  return isValidSessionToken(token);
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE;
}
