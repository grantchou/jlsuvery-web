import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們",
  description: "JLSUVERY 公司背景、核心理念與合作方式。",
};

export default function AboutPage() {
  return (
    <section className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">關於我們</h1>
      <p className="text-slate-700">
        JLSUVERY 致力於提供可靠的企業合作服務，將供應資訊、服務說明與聯繫流程整合成清楚且可持續擴充的平台。
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl bg-slate-50 p-4">
          <h2 className="font-semibold text-slate-900">透明溝通</h2>
          <p className="mt-2 text-sm text-slate-700">以清楚文件與流程說明，降低合作摩擦成本。</p>
        </article>
        <article className="rounded-xl bg-slate-50 p-4">
          <h2 className="font-semibold text-slate-900">穩定交付</h2>
          <p className="mt-2 text-sm text-slate-700">用可追蹤、可維護的系統化方式累積企業資產。</p>
        </article>
        <article className="rounded-xl bg-slate-50 p-4">
          <h2 className="font-semibold text-slate-900">持續擴充</h2>
          <p className="mt-2 text-sm text-slate-700">網站架構支援後續新增後台、會員、更多模組功能。</p>
        </article>
      </div>
    </section>
  );
}
