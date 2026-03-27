import type { Metadata } from "next";
import Link from "next/link";

const faqItems = [
  {
    q: "如何與 JLSUVERY 聯繫？",
    a: "請至「聯絡我們」頁面填寫表單，留下姓名、電話與需求內容。送出後系統會存檔並寄送通知，我們會依序回覆。",
  },
  {
    q: "多久會收到回覆？",
    a: "工作日內會盡快處理；實際回覆時間依案件複雜度與詢問量而定。若為急件，請在主旨或內容中註明。",
  },
  {
    q: "可以索取公司或合作相關文件嗎？",
    a: "可至「文件說明」瀏覽流程與條款摘要；若需正式文件或補件，請於聯絡表單中說明用途，我們會另行提供。",
  },
  {
    q: "網站之後會增加哪些功能？",
    a: "目前為第一版形象與聯繫平台，後續可擴充檔案下載、後台內容管理等。若有優先需求，歡迎透過表單告知。",
  },
];

export const metadata: Metadata = {
  title: "常見問題",
  description: "JLSUVERY 常見問題與聯繫說明。",
};

export default function FaqPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">常見問題</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          以下為常見詢問整理。若未涵蓋您的情境，請直接{" "}
          <Link href="/contact" className="font-medium text-sky-800 underline-offset-4 hover:underline">
            聯絡我們
          </Link>
          。
        </p>
      </div>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {faqItems.map((item) => (
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
