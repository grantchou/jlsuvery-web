import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "常見問題",
  description: "JLSUVERY 常見問題與聯繫說明。",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const content = await getSiteContent();
  const faq = content.faq;

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{faq.heading}</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          {faq.intro}{" "}
          <Link href="/contact" className="font-medium text-sky-800 underline-offset-4 hover:underline">
            聯絡我們
          </Link>
          。
        </p>
      </div>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {faq.items.map((item) => (
          <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none">
              <span className="flex items-start justify-between gap-3">
                <span>{item.q}</span>
                <span className="shrink-0 text-slate-400 transition group-open:rotate-180">▼</span>
              </span>
            </summary>
            <p className="mt-3 text-slate-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
