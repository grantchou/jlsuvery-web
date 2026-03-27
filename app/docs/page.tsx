import type { Metadata } from "next";

const documentSections = [
  {
    title: "合作流程",
    details: ["需求提出", "可行性確認", "交付時程與驗收"],
  },
  {
    title: "服務條款",
    details: ["資料使用範圍", "雙方責任", "變更與終止規範"],
  },
  {
    title: "常見問題",
    details: ["回覆時效", "窗口資訊", "資料補件方式"],
  },
];

export const metadata: Metadata = {
  title: "文件說明",
  description: "合作流程、服務條款與常見問題文件。",
};

export default function DocsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">文件說明</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {documentSections.map((section) => (
          <article key={section.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {section.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
