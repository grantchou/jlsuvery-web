import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "填寫表單即可聯繫 JLSUVERY，公司需求將同步存檔與寄送通知。",
};

export default function ContactPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">聯絡我們</h1>
      <p className="max-w-3xl text-slate-700">
        請留下您的需求資訊，我們會盡快與您聯繫。送出後系統會同時保存資料並發送通知信件。
      </p>
      <ContactForm />
    </section>
  );
}
