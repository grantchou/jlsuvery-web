import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "文件說明",
  description: "合作流程、服務條款與常見問題文件。",
};

export const dynamic = "force-dynamic";

export default async function DocsPage() {
  const content = await getSiteContent();
  const docs = content.docs;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{docs.heading}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {docs.sections.map((section) => (
          <article key={section.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {section.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {section.link ? (
              <p className="mt-4">
                <Link
                  href={section.link.href}
                  className="text-sm font-medium text-sky-800 underline-offset-4 hover:underline"
                >
                  {section.link.label}
                </Link>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
