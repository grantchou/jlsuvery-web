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

export async function sendContactMail(payload: ContactMailPayload): Promise<void> {
  const to = process.env.CONTACT_RECEIVER_EMAIL;
  if (!to) {
    throw new Error("缺少 CONTACT_RECEIVER_EMAIL");
  }

  const from = process.env.CONTACT_SENDER_EMAIL ?? "noreply@jlsuvery.tw";
  const textBody = buildMailText(payload);
  const mailSubject = `[JLSUVERY 聯絡表單] ${payload.subject}`;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
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

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("缺少 SMTP 設定與 RESEND_API_KEY");
  }
  const resend = new Resend(resendApiKey);
  await resend.emails.send({
    from,
    to,
    subject: mailSubject,
    text: textBody,
    replyTo: payload.email,
  });
}
