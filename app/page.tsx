import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <section className="space-y-10">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-sky-700">www.jlsuvery.tw</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {content.home.headline}
        </h1>
        <p className="mt-4 max-w-3xl text-slate-600">{content.home.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {content.home.highlights.map((item) => (
          <article key={item} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-base font-semibold text-slate-900">{item}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
