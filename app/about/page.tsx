import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "關於我們",
  description: "JLSUVERY 公司背景、核心理念與合作方式。",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  const about = content.about;

  return (
    <section className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{about.heading}</h1>
      <p className="text-slate-700">{about.intro}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {about.cards.map((card) => (
          <article key={card.title} className="rounded-xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
