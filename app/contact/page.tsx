import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "填寫表單即可聯繫 JLSUVERY，公司需求將同步存檔與寄送通知。",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{content.contact.heading}</h1>
      <p className="max-w-3xl text-slate-700">{content.contact.intro}</p>
      <ContactForm />
    </section>
  );
}
