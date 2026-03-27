import { getSiteContent } from "@/lib/site-content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-lg shadow-slate-200/50 backdrop-blur-sm md:p-10">
        <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
          www.jlsuvery.tw
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {content.home.headline}
        </h1>
        <p className="mt-4 max-w-3xl leading-8 text-slate-600">{content.home.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            立即聯絡
          </Link>
          <Link
            href="/services"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-slate-400"
          >
            查看服務
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {content.home.highlights.map((item) => (
          <article
            key={item}
            className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-base font-semibold text-slate-900">{item}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
