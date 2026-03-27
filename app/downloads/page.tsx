import type { Metadata } from "next";

type DownloadItem = {
  title: string;
  description: string;
  filePath: string;
};

const downloadItems: DownloadItem[] = [
  {
    title: "公司簡介（範例）",
    description: "提供 JLSUVERY 第一版網站用途的公司簡介範本檔案。",
    filePath: "/downloads/company-profile-sample.txt",
  },
];

export const metadata: Metadata = {
  title: "檔案下載",
  description: "JLSUVERY 文件下載中心，提供公司簡介與相關檔案。",
};

export default function DownloadsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">檔案下載</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          這裡提供公司介紹與合作相關文件下載。後續你只要把檔案放在
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-sm">public/downloads</code>
          ，再更新此頁清單即可。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {downloadItems.map((item) => (
          <article key={item.filePath} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-slate-700">{item.description}</p>
            <a
              href={item.filePath}
              download
              className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              下載檔案
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
