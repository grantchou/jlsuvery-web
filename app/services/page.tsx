import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "服務項目",
  description: "JLSUVERY 提供的服務與支援項目。",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <section className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{content.services.heading}</h1>
      <ul className="list-disc space-y-2 pl-5 text-slate-700">
        {content.services.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
