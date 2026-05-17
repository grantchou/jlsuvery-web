import nodemailer from "nodemailer";
import { Resend } from "resend";

type ContactMailPayload = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const appName = "JLSUVERY 官網";
const defaultSenderName = "JLSUVERY";
const resendTestFrom = `${defaultSenderName} <onboarding@resend.dev>`;

function buildMailText(payload: ContactMailPayload): string {
  return [
    `來源：${appName}`,
    `姓名：${payload.name}`,
    `電話：${payload.phone}`,
    `Email：${payload.email}`,
    `主旨：${payload.subject}`,
    "",
    "需求內容：",
    payload.message,
  ].join("\n");
}

function stripEnvQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function isEmailAddress(value: string): boolean {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

/** 將 CONTACT_SENDER_EMAIL / CONTACT_SENDER_NAME 轉成 Resend／SMTP 可用的 from */
export function resolveContactFromAddress(): string {
  const rawEmail = stripEnvQuotes(process.env.CONTACT_SENDER_EMAIL ?? "");
  const senderName = stripEnvQuotes(process.env.CONTACT_SENDER_NAME ?? defaultSenderName);

  if (!rawEmail) {
    return resendTestFrom;
  }

  const namedMatch = rawEmail.match(/^(.+?)\s*<([^>]+)>$/);
  if (namedMatch) {
    const name = namedMatch[1].trim();
    const email = namedMatch[2].trim();
    if (!isEmailAddress(email)) {
      throw new Error(
        `CONTACT_SENDER_EMAIL 格式無效（${rawEmail}）。請用：JLSUVERY <notify@jlsuvery.tw> 或僅填 notify@jlsuvery.tw`,
      );
    }
    return `${name} <${email}>`;
  }

  if (isEmailAddress(rawEmail)) {
    return `${senderName} <${rawEmail}>`;
  }

  throw new Error(
    `CONTACT_SENDER_EMAIL 格式無效（${rawEmail}）。請用：notify@jlsuvery.tw 或 JLSUVERY <notify@jlsuvery.tw>`,
  );
}

function mapResendError(message: string): string {
  if (message.includes("domain is not verified") || message.includes("verify a domain")) {
    return [
      "Resend 寄件網域尚未驗證。",
      "請到 resend.com/domains 新增並驗證 jlsuvery.tw，",
      "並將 CONTACT_SENDER_EMAIL 設為該網域信箱（例如 notify@jlsuvery.tw）。",
      "測試階段可改設 CONTACT_SENDER_EMAIL=onboarding@resend.dev，",
      "且 CONTACT_RECEIVER_EMAIL 必須是 Resend 註冊信箱。",
    ].join("");
  }
  if (message.includes("Invalid `from`")) {
    return `Resend 寄件者格式錯誤：${message}。請使用 notify@jlsuvery.tw 或 JLSUVERY <notify@jlsuvery.tw>`;
  }
  return `Resend 寄信失敗：${message}`;
}

export async function sendContactMail(payload: ContactMailPayload): Promise<void> {
  const to = stripEnvQuotes(process.env.CONTACT_RECEIVER_EMAIL ?? "");
  if (!to || !isEmailAddress(to)) {
    throw new Error("缺少或格式錯誤的 CONTACT_RECEIVER_EMAIL");
  }

  const from = resolveContactFromAddress();
  const textBody = buildMailText(payload);
  const mailSubject = `[JLSUVERY 聯絡表單] ${payload.subject}`;
  const smtpHost = stripEnvQuotes(process.env.SMTP_HOST ?? "");
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = stripEnvQuotes(process.env.SMTP_USER ?? "");
  const smtpPass = stripEnvQuotes(process.env.SMTP_PASS ?? "");

  if (smtpHost && smtpUser && smtpPass) {
    const isGmail = smtpHost.includes("gmail.com");
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: isGmail && smtpPort === 587,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from,
      to,
      subject: mailSubject,
      text: textBody,
      replyTo: payload.email,
    });
    return;
  }

  const resendApiKey = stripEnvQuotes(process.env.RESEND_API_KEY ?? "");
  if (!resendApiKey) {
    throw new Error("缺少 SMTP 設定與 RESEND_API_KEY");
  }

  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: mailSubject,
    text: textBody,
    replyTo: payload.email,
  });
  if (error) {
    throw new Error(mapResendError(error.message));
  }
  if (!data?.id) {
    throw new Error("Resend 寄信失敗：未取得郵件 ID");
  }
}
