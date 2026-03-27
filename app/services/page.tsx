import type { Metadata } from "next";

const serviceItems = [
  {
    title: "企業資料整理",
    description: "彙整公司資訊與供應項目，建立對外可讀的標準化內容。",
  },
  {
    title: "流程說明文件",
    description: "建立合作流程、交付節點與常見問題，提升溝通效率。",
  },
  {
    title: "聯繫窗口整合",
    description: "整合聯絡需求收件、存檔與通知，讓商機不遺漏。",
  },
];

export const metadata: Metadata = {
  title: "服務項目",
  description: "JLSUVERY 提供的服務項目與合作範圍。",
};

export default function ServicesPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">服務項目</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {serviceItems.map((service) => (
          <article key={service.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">{service.title}</h2>
            <p className="mt-3 text-slate-700">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
